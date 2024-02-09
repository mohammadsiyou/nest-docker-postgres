import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Doctor } from "./doctor.entity";
import { Repository } from "typeorm";

@Injectable()
export class DoctorsService {
    constructor(@InjectRepository(Doctor) private doctorsRepository: Repository<Doctor>) { }

    async findAll(): Promise<Doctor[]> {
        return await this.doctorsRepository.find();
    }

    async findOne(id: string): Promise<Doctor> {
        return await this.doctorsRepository.findOneBy({ id });
    }

    async create(doctor: Partial<Doctor>): Promise<Doctor> {
        const newDoctor = this.doctorsRepository.create(doctor);

        return await this.doctorsRepository.save(newDoctor);
    }

    async update(id: string, doctor: Partial<Doctor>): Promise<Doctor> {
        await this.doctorsRepository.update(id, doctor);
        return this.doctorsRepository.findOneBy({ id });
    }

    async delete(id: string): Promise<void> {
        await this.doctorsRepository.delete({ id });
    }
}
