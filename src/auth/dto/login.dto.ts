import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

export class loginDto {
	@MinLength(6)
	@MaxLength(50)
	@IsEmail()
	email: string

	@MinLength(6, {
		message: 'Password must be at least 6 characters long'
	})
	@MaxLength(45)
	@IsString()
	password: string
}
