import { DoctorsService } from './doctors.service';
import { Doctor } from './doctor.entity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { Repository } from 'typeorm';

const createDoctorDto: CreateDoctorDto = {
	fullName: 'Doctor',
	email: 'doctor@doctor.com',
};

const doctors: Doctor[] = [{ id: '123', fullName: 'Doctor1', email: 'doctor@doctor.com', appointments: [] }];

describe('DoctorsService', () => {
	let doctorsService: DoctorsService;
	let doctorsRepository: Repository<Doctor>;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				DoctorsService,
				{
					// To mock doctorsRepository
					provide: getRepositoryToken(Doctor),
					useValue: {
						find: jest.fn().mockResolvedValue(doctors),
						findOneBy: jest
							.fn()
							.mockImplementation(({ id }: Doctor) => Promise.resolve({ ...createDoctorDto, id })),
						create: jest.fn().mockImplementation((doctor: CreateDoctorDto) => doctor),
						save: jest
							.fn()
							.mockImplementation((doctor: CreateDoctorDto) =>
								Promise.resolve({ ...doctor, id: '5555' })
							),
						update: jest.fn(),
						delete: jest.fn(),
					},
				},
			],
		}).compile();

		doctorsService = moduleRef.get<DoctorsService>(DoctorsService);
		doctorsRepository = moduleRef.get<Repository<Doctor>>(getRepositoryToken(Doctor));
	});

	it('doctorsService should be defined', () => {
		expect(doctorsService).toBeDefined();
	});

	describe('findAll', () => {
		it('should return an array of doctors', async () => {
			const newDoctors = await doctorsService.findAll();

			expect(newDoctors).toEqual(doctors);
		});
	});

	describe('findOne', () => {
		it('should return a single doctor', async () => {
			const newDoctor = await doctorsService.findOne('1111');

			expect(newDoctor).toEqual({ ...createDoctorDto, id: '1111' });
		});
	});

	describe('create', () => {
		it('should successfully create a doctor', async () => {
			const newDoctor = await doctorsService.create(createDoctorDto);

			expect(newDoctor).toEqual({ ...createDoctorDto, id: '5555' });
		});
	});

	describe('update', () => {
		it('should successfully update a doctor', async () => {
			const id = '9999';

			const res = await doctorsService.update(id, createDoctorDto);

			expect(res).toEqual({ ...createDoctorDto, id });

			expect(doctorsRepository.update).toHaveBeenCalledWith(id, createDoctorDto);

			expect(doctorsRepository.update).toHaveBeenCalledTimes(1);
		});
	});

	describe('delete', () => {
		it('should call delete with the passed value', async () => {
			const id = '6666';

			const res = await doctorsService.delete(id);

			expect(doctorsRepository.delete).toHaveBeenCalledTimes(1);

			expect(doctorsRepository.delete).toHaveBeenCalledWith({ id });

			expect(res).toBeUndefined();
		});
	});
});
