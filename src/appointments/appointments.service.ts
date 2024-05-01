import { Injectable } from '@nestjs/common';
import { Appointment } from './appointment.entity';
import { And, DataSource, Equal, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not } from 'typeorm';
import { Doctor } from 'src/doctors/doctor.entity';
import { Patient } from 'src/patients/patient.entity';

@Injectable()
export class AppointmentsService {
	constructor(private dataSource: DataSource) {}

	async addApponitment(doctor: Doctor, time: { start: Date; end: Date }) {
		const { start, end } = time;

		const appointmentIsFound = await this.dataSource.manager.findOne(Appointment, {
			where: [
				{
					startDate: And(MoreThanOrEqual(start), LessThan(end)),
				},
				{
					endDate: And(MoreThan(start), LessThanOrEqual(end)),
				},
				{
					startDate: LessThanOrEqual(start),
					endDate: MoreThanOrEqual(end),
				},
				{
					doctor: {
						id: Not(Equal(doctor.id)),
					},
				},
			],
		});

		if (!appointmentIsFound) {
			const newAppointment = this.dataSource.manager.create(Appointment, {
				startDate: start,
				endDate: end,
				doctor,
			});

			await this.dataSource.manager.save(newAppointment);
		}
	}

	async getDoctorAppointments(doctorId: string): Promise<Appointment[]> {
		const appointments = await this.dataSource.manager.find(Appointment, {
			relations: {
				patient: true,
			},
			where: {
				doctor: {
					id: doctorId,
				},
				startDate: MoreThanOrEqual(new Date()),
			},
			select: {
				id: true,
				startDate: true,
				endDate: true,
				patient: {
					fullName: true,
					phoneNumber: true,
				},
			},
		});

		return appointments;
	}

	async getAppointment(appointmentId: string): Promise<Appointment> {
		const appointment = await this.dataSource.manager
			.createQueryBuilder(Appointment, 'appointment')
			.useTransaction(true)
			.setLock('pessimistic_write')
			.where('appointment.id = :appointmentId', { appointmentId })
			.getOne();

		return appointment;
	}

	async deleteAppointment(appointmentId: string): Promise<void> {
		const queryRunner = this.dataSource.createQueryRunner();

		await queryRunner.connect();

		await queryRunner.startTransaction();

		try {
			await queryRunner.manager
				.createQueryBuilder(Appointment, 'appointment')
				.useTransaction(true)
				.setLock('pessimistic_write')
				.setOnLocked('nowait')
				.where('id = :appointmentId', { appointmentId })
				.andWhere('isReserved = false')
				.delete()
				.execute();

			await queryRunner.commitTransaction();
		} catch (err) {
			console.log('Error in deleting the appointment.');
			await queryRunner.rollbackTransaction();
		} finally {
			await queryRunner.release();
		}
	}

	async getOpenAppointments(): Promise<Appointment[]> {
		const appointments = await this.dataSource.manager.find(Appointment, {
			relations: {
				doctor: true,
			},
			where: {
				startDate: MoreThanOrEqual(new Date()),
				isReserved: false,
			},
			select: {
				id: true,
				startDate: true,
				doctor: {
					fullName: true,
				},
			},
		});

		return appointments;
	}

	async takeAppointment(appointmentId: string, patient: Patient) {
		const queryRunner = this.dataSource.createQueryRunner();

		await queryRunner.connect();

		await queryRunner.startTransaction();

		try {
			await queryRunner.manager
				.createQueryBuilder(Appointment, 'appointment')
				.useTransaction(true)
				.setLock('pessimistic_write')
				.setOnLocked('nowait')
				.where('id = :appointmentId', { appointmentId })
				.andWhere('isReserved = false')
				.update()
				.set({
					patient,
					isReserved: true,
				})
				.execute();

			await queryRunner.commitTransaction();
		} catch (err) {
			console.log('Error in taking the appointment.');
			await queryRunner.rollbackTransaction();
		} finally {
			await queryRunner.release();
		}
	}

	async getPatientAppointments(patientId: string): Promise<Appointment[]> {
		const appointments = await this.dataSource.manager.find(Appointment, {
			relations: {
				doctor: true,
			},
			where: {
				patient: {
					id: patientId,
				},
			},
			select: {
				id: true,
				startDate: true,
				doctor: {
					fullName: true,
				},
			},
		});

		return appointments;
	}
}
