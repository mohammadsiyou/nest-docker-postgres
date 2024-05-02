import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class LoginPatientDto {
	@IsNotEmpty({ message: 'Phone number must not be empty.' })
	@IsPhoneNumber('IR', { message: 'Phone number must be a valid international phone number.' })
	phoneNumber: string;

	@IsNotEmpty({ message: 'Password must not be empty.' })
	@IsString({ message: 'Password must be a string.' })
	password: string;
}
