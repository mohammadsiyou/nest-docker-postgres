import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Appointment } from "./appointment.entity";
import { And, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from "typeorm";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { Doctor } from "src/doctors/doctor.entity";
import * as constants from 'src/helper/constants.json';
import { splitTime } from "src/helper/utilities";

const { TimeSlot } = constants;

@Injectable()
export class AppointmentsService {
    constructor(@InjectRepository(Appointment) private appointmentsRepository: Repository<Appointment>,
        @InjectRepository(Doctor) private doctorRepository: Repository<Doctor>) { }

    async addApponitments(doctorId: string, appointment: CreateAppointmentDto): Promise<void> {
        const { startDate, endDate } = appointment;

        const times = splitTime(new Date(startDate).getTime(), new Date(endDate).getTime(), TimeSlot);

        const doctor = await this.doctorRepository.findOneBy({ id: doctorId });

        if (!doctor)
            throw new Error("Doctor not found");

        await Promise.allSettled(times.map(async (time) => {
            const start = new Date(time);
            const end = new Date(time + TimeSlot);

            try {
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

                return;
            }
            catch (err) {
                console.log(err)
            }

            throw new Error("Time Overlaping")
        }));
    }
}
