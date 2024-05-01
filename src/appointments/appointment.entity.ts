import { Doctor } from 'src/doctors/doctor.entity';
import { Patient } from 'src/patients/patient.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Appointment {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'timestamp' })
	startDate: Date;

	@Column({ type: 'timestamp' })
	endDate: Date;

	@Column({ type: 'boolean', default: false })
	isReserved: boolean;

	@ManyToOne(() => Doctor, (doctor) => doctor.appointments)
	doctor: Doctor;

	@ManyToOne(() => Patient, (patient) => patient.appointments)
	patient: Patient;
}
