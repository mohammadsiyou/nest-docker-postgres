import { Appointment } from "src/appointments/appointment.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Doctor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    fullName: string;

    @Column({ unique: true })
    email: string;

    @OneToMany(() => Appointment, appointment => appointment.id)
    appointments: Appointment[]
}
