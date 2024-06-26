import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';

@Injectable()
export class PatientsService {
	constructor(@InjectRepository(Patient) private patientsRepository: Repository<Patient>) {}

	async findAll(): Promise<Patient[]> {
		return await this.patientsRepository.find();
	}

	async findOne(id: string): Promise<Patient> {
		return await this.patientsRepository.findOneBy({ id });
	}

	async findByPhoneNumber(phoneNumber: string): Promise<Patient> {
		return await this.patientsRepository.findOneBy({ phoneNumber });
	}

	async create(patient: Partial<Patient>): Promise<Patient> {
		const newPatient = this.patientsRepository.create(patient);

		return await this.patientsRepository.save(newPatient);
	}

	async update(id: string, patient: Partial<Patient>): Promise<Patient> {
		await this.patientsRepository.update(id, patient);

		return await this.patientsRepository.findOneBy({ id });
	}

	async delete(id: string): Promise<void> {
		await this.patientsRepository.delete({ id });
	}
}
