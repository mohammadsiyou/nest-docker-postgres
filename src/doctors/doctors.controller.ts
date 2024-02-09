import { BadRequestException, Body, Controller, Delete, Get, HttpException, InternalServerErrorException, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { DoctorsService } from "./doctors.service";
import { CreateDoctorDto } from "./dto/create-doctor.dto";
import { Doctor } from "./doctor.entity";
import { UpdateDoctorDto } from "./dto/update-doctor.dto";
import { CreateAppointmentDto } from "src/appointments/dto/create-appointment.dto";
import { AppointmentsService } from "src/appointments/appointments.service";
import { Appointment } from "src/appointments/appointment.entity";
import { splitTime } from "src/helper/utilities";
import * as constants from 'src/helper/constants.json';

const { TimeSlot } = constants;

@Controller('doctors')
export class DoctorsController {
    constructor(private readonly doctorsService: DoctorsService, private readonly appointmentsService: AppointmentsService) { }

    @Get()
    findAll(): Promise<Doctor[]> {
        return this.doctorsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Doctor> {
        return this.doctorsService.findOne(id);
    }

    @Post()
    create(@Body() createDoctorDto: CreateDoctorDto): Promise<Doctor> {
        return this.doctorsService.create(createDoctorDto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
        return this.doctorsService.update(id, updateDoctorDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.doctorsService.delete(id);
    }

    @Post(':id/appointments')
    async addAppointments(@Param('id') id: string, @Body() createAppointment: CreateAppointmentDto): Promise<string> {
        const { startDate, endDate } = createAppointment;

        if (new Date(startDate).getTime() > new Date(endDate).getTime())
            throw new BadRequestException('endDate must be greater than startDate');

        const doctor = await this.findOne(id);

        if (!doctor)
            throw new InternalServerErrorException('Doctor not found');

        const times = splitTime(new Date(startDate).getTime(), new Date(endDate).getTime(), TimeSlot);

        await Promise.allSettled(times.map(async (time) => {
            const start = new Date(time);
            const end = new Date(time + TimeSlot);

            try {
                await this.appointmentsService.addApponitment(doctor, { start, end });
            }
            catch (err) {
                console.log(err);
            }
        }));

        return 'Appointments added.';
    }

    @Get(':id/appointments')
    async getAppointments(@Param('id') id: string): Promise<Appointment[]> {
        const doctor = await this.findOne(id);

        if (!doctor)
            throw new InternalServerErrorException('Doctor not found');

        const appointments = await this.appointmentsService.getDoctorAppointments(doctor.id);

        return appointments;
    }

    @Delete(':id/appointments/:appointmentId')
    async deleteAppointment(@Param('id') id: string, @Param('appointmentId') appointmentId: string): Promise<void> {
        const doctor = await this.findOne(id);

        if (!doctor)
            throw new InternalServerErrorException('Doctor not found.');

        const appointment = await this.appointmentsService.getAppointment(appointmentId);

        if (!appointment)
            throw new NotFoundException('Appointment not found.');

        if (appointment.isReserved)
            throw new HttpException("The appointment has taken.", 406)

        await this.appointmentsService.deleteAppointment(appointmentId);
    }
}
