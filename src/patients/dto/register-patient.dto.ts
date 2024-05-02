import { IsNotEmpty, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterPatientDto {
	@IsNotEmpty({ message: 'Full name must not be empty.' })
	@IsString({ message: 'Full name must be a string.' })
	@MinLength(4, { message: 'Full name must be at least 4 characters long.' })
	@MaxLength(100, { message: 'Full name cannot be longer than 100 characters.' })
	fullName: string;

	@IsNotEmpty({ message: 'Phone number must not be empty.' })
	@IsPhoneNumber('IR', { message: 'Phone number must be a valid international phone number.' })
	phoneNumber: string;

	@IsNotEmpty({ message: 'Password must not be empty.' })
	@IsString({ message: 'Password must be a string.' })
	@MinLength(8, { message: 'Password must be at least 8 characters long.' })
	password: string;
}
