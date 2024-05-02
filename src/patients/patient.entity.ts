import { Appointment } from 'src/appointments/appointment.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Patient {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	fullName: string;

	@Column({ unique: true })
	phoneNumber: string;

	@Column()
	password: string;

	@OneToMany(() => Appointment, (appointment) => appointment.patient)
	appointments: Appointment[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
