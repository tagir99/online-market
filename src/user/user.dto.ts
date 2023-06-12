import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator'

export class UserDto {
	@MaxLength(55)
	@IsEmail()
	email: string

	@MaxLength(55)
	@IsOptional()
	@IsString()
	password?: string

	@MaxLength(55)
	@IsOptional()
	@IsString()
	name: string

	@IsOptional()
	@IsString()
	phone?: string
}
