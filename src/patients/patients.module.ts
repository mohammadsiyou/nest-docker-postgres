import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppoinmentsModule } from 'src/appointments/appointments.module';
import { Patient } from './patient.entity';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';

@Module({
	imports: [TypeOrmModule.forFeature([Patient]), AppoinmentsModule],
	controllers: [PatientsController],
	providers: [PatientsService],
	exports: [PatientsService],
})
export class PatientsModule {}
