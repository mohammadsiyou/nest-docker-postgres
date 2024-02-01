import { Module } from "@nestjs/common";
import { AppointmentsService } from "./appointments.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Appointment } from "./appointment.entity";
import { Doctor } from "src/doctors/doctor.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Appointment, Doctor])],
    providers: [AppointmentsService],
    exports: [AppointmentsService],
})
export class AppoinmentsModule { }
