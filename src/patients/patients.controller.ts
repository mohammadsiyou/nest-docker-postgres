import { Body, Controller, Delete, Get, HttpException, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { Appointment } from 'src/appointments/appointment.entity';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { TakeAppointmentDto } from 'src/appointments/dto/take-appointment.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './patient.entity';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
	constructor(
		private readonly patientsService: PatientsService,
		private readonly appointmentsService: AppointmentsService
	) {}

	@Get('appointments')
	async getOpenAppointments(): Promise<Appointment[]> {
		return this.appointmentsService.getOpenAppointments();
	}

	@Get()
	findAll(): Promise<Patient[]> {
		return this.patientsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string): Promise<Patient> {
		return this.patientsService.findOne(id);
	}

	// @Post()
	// create(@Body() registerDoctorDto: RegisterPatientDto): Promise<Patient> {
	// 	return this.patientsService.create(registerDoctorDto);
	// }

	@Put(':id')
	update(@Param('id') id: string, @Body() updateDoctorDto: UpdatePatientDto) {
		return this.patientsService.update(id, updateDoctorDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string): Promise<void> {
		return this.patientsService.delete(id);
	}

	@Post(':id/appointments')
	async takeAppointment(@Param('id') id: string, @Body() takeAppointmentDto: TakeAppointmentDto) {
		const patient = await this.findOne(id);

		if (!patient) throw new NotFoundException('Patient not found.');

		const { appointmentId } = takeAppointmentDto;

		const appointment = await this.appointmentsService.getAppointment(appointmentId);

		if (!appointment || appointment?.isReserved)
			throw new HttpException('The appointment has taken or deleted.', 406);

		await this.appointmentsService.takeAppointment(appointment.id, patient);

		return 'The Appointment created successfully.';
	}

	@Get(':id/appointments')
	async getPatientAppointments(@Param('id') id: string): Promise<Appointment[]> {
		return this.appointmentsService.getPatientAppointments(id);
	}
}
