import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginPatientDto } from 'src/patients/dto/login-patient.dto';
import { RegisterPatientDto } from 'src/patients/dto/register-patient.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('register')
	@UsePipes(new ValidationPipe({ transform: true }))
	patientRegister(@Body() registerDto: RegisterPatientDto) {
		return this.authService.patientRegister(registerDto);
	}

	@Post('login')
	@UsePipes(new ValidationPipe({ transform: true }))
	patientLogin(@Body() loginDto: LoginPatientDto) {
		return this.authService.patientLogin(loginDto);
	}
}
