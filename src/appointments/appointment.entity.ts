import { Doctor } from "src/doctors/doctor.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column({ default: false })
    isReserved: boolean;

    @ManyToOne(() => Doctor, doctor => doctor.appointments)
    doctor: Doctor;
}
