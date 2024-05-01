import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { Doctor } from './doctor.entity';
import { Test } from '@nestjs/testing';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { Appointment } from 'src/appointments/appointment.entity';

const createDoctorDto: CreateDoctorDto = {
	fullName: 'Doctor',
	email: 'doctor@doctor.com',
};

const doctors: Doctor[] = [{ id: '123', fullName: 'Doctor1', email: 'doctor@doctor.com', appointments: [] }];

const appointment: Appointment = {
	id: '111',
	startDate: new Date(),
	endDate: new Date(),
	isReserved: true,
	doctor: null,
	patient: null,
};

describe('DoctorsController', () => {
	let doctorsController: DoctorsController;
	let doctorsService: DoctorsService;
	let appointmentsService: AppointmentsService;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			controllers: [DoctorsController],
			providers: [
				DoctorsService,
				{
					// To mock doctorsRepository
					provide: getRepositoryToken(Doctor),
					useValue: {},
				},
				{
					provide: DoctorsService,
					useValue: {
						findAll: jest.fn().mockResolvedValue(doctors),
						findOne: jest
							.fn()
							.mockImplementation((id: string) => Promise.resolve({ ...createDoctorDto, id })),
						create: jest
							.fn()
							.mockImplementation((newDoctor: CreateDoctorDto) =>
								Promise.resolve({ ...newDoctor, id: '1111' })
							),
						update: jest
							.fn()
							.mockImplementation((id: string, newDoctor: CreateDoctorDto) =>
								Promise.resolve({ ...newDoctor, id })
							),
						delete: jest.fn(),
					},
				},
				AppointmentsService,
				{
					provide: AppointmentsService,
					useValue: {
						addApponitment: jest.fn(),
						getDoctorAppointments: jest
							.fn()
							.mockImplementation((id: string) => Promise.resolve({ ...appointment, id })),
						getAppointment: jest.fn(),
						deleteAppointment: jest.fn(),
					},
				},
				{
					// To mock datasource
					provide: getDataSourceToken(),
					useValue: {},
				},
			],
		}).compile();

		doctorsService = moduleRef.get<DoctorsService>(DoctorsService);
		appointmentsService = moduleRef.get<AppointmentsService>(AppointmentsService);
		doctorsController = moduleRef.get<DoctorsController>(DoctorsController);
	});

	it('doctorsController should be defined', () => {
		expect(doctorsController).toBeDefined();
	});

	describe('findAll', () => {
		it('should return an array of doctors', async () => {
			expect(doctorsController.findAll()).resolves.toEqual(doctors);

			expect(doctorsService.findAll).toHaveBeenCalledTimes(1);
		});
	});

	describe('findOne', () => {
		it('should return a doctor', async () => {
			expect(doctorsController.findOne('1')).resolves.toEqual({ id: '1', ...createDoctorDto });

			expect(doctorsService.findOne).toHaveBeenCalledTimes(1);
		});
	});

	describe('create', () => {
		it('should create a new doctor', async () => {
			expect(doctorsController.create(createDoctorDto)).resolves.toEqual({ ...createDoctorDto, id: '1111' });

			expect(doctorsService.create).toHaveBeenCalledTimes(1);
		});
	});

	describe('update', () => {
		it('should update a doctor', async () => {
			expect(doctorsController.update('2222', createDoctorDto)).resolves.toEqual({
				...createDoctorDto,
				id: '2222',
			});

			expect(doctorsService.update).toHaveBeenCalledTimes(1);
		});
	});

	describe('remove', () => {
		it('should remove the doctor', async () => {
			doctorsController.remove('1');

			expect(doctorsService.delete).toHaveBeenCalledTimes(1);
		});
	});

	describe('addAppointments', () => {
		it('should throw "endDate must be greater than startDate"', () => {
			expect(
				doctorsController.addAppointments('', { startDate: new Date(), endDate: new Date(Date.now() - 1) })
			).rejects.toThrow('endDate must be greater than startDate');
		});
		it('should throw "Doctor not found"', () => {
			jest.spyOn(doctorsController, 'findOne').mockImplementation(() => null);

			expect(
				doctorsController.addAppointments('', { startDate: new Date(), endDate: new Date(Date.now()) })
			).rejects.toThrow('Doctor not found');
		});
		it('should return "Appointments added."', () => {
			expect(
				doctorsController.addAppointments('', { startDate: new Date(), endDate: new Date(Date.now()) })
			).resolves.toBe('Appointments added.');
		});
		it('"addApponitment" should be called 3 times', async () => {
			const startDate = new Date();
			const endDate = new Date(Date.now() + 1800000 * 3);

			await doctorsController.addAppointments('', { startDate, endDate });

			expect(appointmentsService.addApponitment).toHaveBeenCalledTimes(3);
		});
	});

	describe('getAppointments', () => {
		it('should throw "Doctor not found"', () => {
			jest.spyOn(doctorsController, 'findOne').mockImplementation(() => null);

			expect(doctorsController.getAppointments('')).rejects.toThrow('Doctor not found');
		});
		it('should return an appointment', () => {
			jest.spyOn(doctorsController, 'findOne').mockImplementation(() =>
				Promise.resolve({ ...createDoctorDto, id: '111', appointments: [] })
			);

			expect(doctorsController.getAppointments('111')).resolves.toEqual({ ...appointment, id: '111' });
		});
	});

	describe('deleteAppointment', () => {
		it('should throw "Doctor not found"', () => {
			jest.spyOn(doctorsController, 'findOne').mockImplementation(() => null);

			expect(doctorsController.deleteAppointment('', '')).rejects.toThrow('Doctor not found.');
		});
		it('should throw "Appointment not found."', () => {
			jest.spyOn(doctorsController, 'findOne').mockImplementation(() => Promise.resolve(doctors[0]));

			expect(doctorsController.deleteAppointment('', '')).rejects.toThrow('Appointment not found.');
		});
		it('should throw "The appointment has taken."', () => {
			jest.spyOn(doctorsController, 'findOne').mockImplementation(() => Promise.resolve(doctors[0]));

			jest.spyOn(appointmentsService, 'getAppointment').mockImplementation(() =>
				Promise.resolve({ ...appointment, isReserved: true })
			);

			expect(doctorsController.deleteAppointment('', '1')).rejects.toThrow('The appointment has taken.');
		});
		it('"deleteAppointment" should be called', async () => {
			jest.spyOn(doctorsController, 'findOne').mockImplementation(() => Promise.resolve(doctors[0]));

			jest.spyOn(appointmentsService, 'getAppointment').mockImplementation(() =>
				Promise.resolve({ ...appointment, isReserved: false })
			);

			await doctorsController.deleteAppointment('', '1');

			expect(appointmentsService.deleteAppointment).toHaveBeenCalledTimes(1);
		});
	});
});
