import { IsOptional, IsString, MaxLength } from 'class-validator'

export class CategoryDto {
	@MaxLength(99)
	@IsString()
	name: string

	@IsOptional()
	@MaxLength(99)
	@IsString()
	slug?: string
}
