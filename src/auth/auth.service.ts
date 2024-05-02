import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as pick from 'lodash/pick';
import { LoginPatientDto } from 'src/patients/dto/login-patient.dto';
import { RegisterPatientDto } from 'src/patients/dto/register-patient.dto';
import { Patient } from 'src/patients/patient.entity';
import { PatientsService } from 'src/patients/patients.service';

@Injectable()
export class AuthService {
	constructor(
		private patientsService: PatientsService,
		private jwtService: JwtService
	) {}

	async hashPassword(password: string): Promise<string> {
		const saltRounds = 10;
		const salt = await bcrypt.genSalt(saltRounds);
		const hashedPassword = await bcrypt.hash(password, salt);
		return hashedPassword;
	}

	async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
		return await bcrypt.compare(password, hashedPassword);
	}

	async patientRegister(registerDto: RegisterPatientDto) {
		const { fullName, phoneNumber, password } = registerDto;

		const foundPhoneNumber = await this.patientsService.findByPhoneNumber(phoneNumber);

		if (foundPhoneNumber) throw new ConflictException('Phone number already exists.');

		const hashedPassword = await this.hashPassword(password);

		const newPatient: Partial<Patient> = {
			fullName,
			phoneNumber,
			password: hashedPassword,
		};

		const patientResult = await this.patientsService.create(newPatient);

		const patientObj = pick(patientResult, ['id', 'fullName', 'phoneNumber']);

		return patientObj;
	}

	async patientLogin(loginDto: LoginPatientDto) {
		const { phoneNumber, password } = loginDto;

		const patient = await this.patientsService.findByPhoneNumber(phoneNumber);

		if (!patient) throw new UnauthorizedException();

		const isPasswordMatch = await this.comparePasswords(password, patient.password);

		if (!isPasswordMatch) throw new UnauthorizedException();

		const payload = { sub: patient.id, phoneNumber: patient.phoneNumber };

		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}
}
