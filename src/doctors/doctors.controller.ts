import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from "@nestjs/common";
import { DoctorsService } from "./doctors.service";
import { CreateDoctorDto } from "./dto/create-doctor.dto";
import { Doctor } from "./doctor.entity";
import { UpdateDoctorDto } from "./dto/update-doctor.dto";
import { CreateAppointmentDto } from "src/appointments/dto/create-appointment.dto";
import { AppointmentsService } from "src/appointments/appointments.service";
import { Response } from "express";

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
        return this.doctorsService.remove(id);
    }

    @Post(':id/appointments')
    async addAppointments(@Param('id') id: string, @Body() createAppointment: CreateAppointmentDto, @Res() res: Response): Promise<void> {
        const { startDate, endDate } = createAppointment;

        if (new Date(startDate).getTime() > new Date(endDate).getTime())
            throw new BadRequestException('endDate must be greater than startDate');

        await this.appointmentsService.addApponitments(id, createAppointment);

        res.status(HttpStatus.CREATED).json('Appointments added.')
    }
}
