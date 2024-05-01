import { Appointment } from 'src/appointments/appointment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Patient {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	fullName: string;

	@Column({ unique: true })
	phoneNumber: string;

	@OneToMany(() => Appointment, (appointment) => appointment.patient)
	appointments: Appointment[];
}
