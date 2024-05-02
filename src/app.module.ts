import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointments/appointment.entity';
import { AppoinmentsModule } from './appointments/appointments.module';
import { Doctor } from './doctors/doctor.entity';
import { DoctorsModule } from './doctors/doctors.module';
import { Patient } from './patients/patient.entity';
import { PatientsModule } from './patients/patients.module';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({
			useFactory: (config: ConfigService) => {
				return {
					type: 'postgres',
					host: config.get('DB_HOST'),
					port: config.get('DB_PORT'),
					username: config.get('DB_USERNAME'),
					password: config.get('DB_PASSWORD'),
					database: config.get('DB_DATABASE'),
					entities: [Doctor, Appointment, Patient],
					synchronize: false,
				};
			},
			inject: [ConfigService],
		}),
		DoctorsModule,
		AppoinmentsModule,
		PatientsModule,
		AuthModule,
	],
})
export class AppModule {}
