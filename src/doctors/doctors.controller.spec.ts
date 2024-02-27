import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { Doctor } from './doctor.entity';
import { Test } from '@nestjs/testing';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { CreateDoctorDto } from './dto/create-doctor.dto';

const createDoctorDto: CreateDoctorDto = {
    fullName: 'Doctor',
    email: "doctor@doctor.com",
}

const doctors: Doctor[] = [{ id: '123', fullName: 'Doctor1', email: "doctor@doctor.com", appointments: [] }];

describe('DoctorsController', () => {
    let doctorsController: DoctorsController;
    let doctorsService: DoctorsService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [DoctorsController],
            providers: [
                DoctorsService,
                {
                    // To mock doctorsRepository
                    provide: getRepositoryToken(Doctor),
                    useValue: {}
                },
                {
                    provide: DoctorsService,
                    useValue: {
                        findAll: jest.fn().mockResolvedValue(doctors),
                        findOne: jest.fn().mockImplementation((id: string) => Promise.resolve({ ...createDoctorDto, id })),
                        create: jest.fn().mockImplementation((newDoctor: CreateDoctorDto) => Promise.resolve({ ...newDoctor, id: '1111' })),
                        update: jest.fn().mockImplementation((id: string, newDoctor: CreateDoctorDto) => Promise.resolve({ ...newDoctor, id })),
                        delete: jest.fn(),
                    }
                },
                AppointmentsService,
                {
                    // To mock datasource
                    provide: getDataSourceToken(),
                    useValue: {}
                },
            ],
        }).compile();

        doctorsService = moduleRef.get<DoctorsService>(DoctorsService);
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
            expect(doctorsController.update('2222', createDoctorDto)).resolves.toEqual({ ...createDoctorDto, id: '2222' });

            expect(doctorsService.update).toHaveBeenCalledTimes(1);
        });
    });

    describe('remove', () => {
        it('should remove the doctor', async () => {
            doctorsController.remove('1');

            expect(doctorsService.delete).toHaveBeenCalledTimes(1);
        });
    });
});
