import { Module } from '@nestjs/common';
import { PatientsModule } from 'src/patients/patients.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
	imports: [PatientsModule],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
