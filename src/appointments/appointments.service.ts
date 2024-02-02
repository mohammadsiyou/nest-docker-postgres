import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Appointment } from "./appointment.entity";
import { And, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from "typeorm";
import { Doctor } from "src/doctors/doctor.entity";

@Injectable()
export class AppointmentsService {
    constructor(@InjectRepository(Appointment) private appointmentsRepository: Repository<Appointment>) { }

    async addApponitment(doctor: Doctor, time: { start: Date; end: Date }) {
        const { start, end } = time;

        const appointmentIsFound = await this.appointmentsRepository.findOne({
            where: [
                {
                    startDate: And(MoreThanOrEqual(start), LessThan(end)),
                },
                {
                    endDate: And(MoreThan(start), LessThanOrEqual(end)),
                },
                {
                    startDate: LessThanOrEqual(start), endDate: MoreThanOrEqual(end)
                }
            ]
        });

        if (!appointmentIsFound) {
            const newAppointment = this.appointmentsRepository.create({ startDate: start, endDate: end, doctor });

            await this.appointmentsRepository.save(newAppointment);
        }
    }

    async getDoctorAppointments(doctor: Doctor): Promise<Appointment[]> {
        const appointments = await this.appointmentsRepository.find({
            relations: {
                patient: true
            },
            where: {
                doctor,
                startDate: MoreThanOrEqual(new Date())
            },
            select: {
                id: true,
                startDate: true,
                endDate: true,
                patient: {
                    fullName: true,
                    phoneNumber: true
                }
            }
        });

        return appointments;
    }
}
