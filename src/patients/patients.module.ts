import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './patient.entity';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { AppoinmentsModule } from 'src/appointments/appointments.module';

@Module({
	imports: [TypeOrmModule.forFeature([Patient]), AppoinmentsModule],
	controllers: [PatientsController],
	providers: [PatientsService],
})
export class PatientsModule {}
