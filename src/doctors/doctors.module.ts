import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './doctor.entity';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { AppoinmentsModule } from 'src/appointments/appointments.module';

@Module({
	imports: [TypeOrmModule.forFeature([Doctor]), AppoinmentsModule],
	controllers: [DoctorsController],
	providers: [DoctorsService],
})
export class DoctorsModule {}
