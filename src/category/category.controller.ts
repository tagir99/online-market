import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from '../auth/decoratosrs/auth.devorator'
import { CategoryDto } from './category.dto'
import { CategoryService } from './category.service'

@Controller('catigories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get('id')
	@Auth()
	async getByIdl(@Param('id') id: string) {
		return this.categoryService.byId(+id)
	}

	// @Get('by-slug/:slug') -- Get By Slug
	// async getBySlug(@Param('slug') slug: string) {
	// 	return this.categoryService.bySlug(slug)
	// }

	@Get()
	async getAll() {
		return this.categoryService.getAll()
	}

	@Auth()
	@HttpCode(200)
	@Post()
	async create() {
		return this.categoryService.create()
	}

	@UsePipes(new ValidationPipe())
	@Auth()
	@HttpCode(200)
	@Put(':id')
	async update(@Param('id') categoryId: string, @Body() dto: CategoryDto) {
		return this.categoryService.update(+categoryId, dto)
	}

	@Auth()
	@HttpCode(200)
	@Delete(':id')
	async delete(@Param('id') categoryId: string) {
		return this.categoryService.delete(+categoryId)
	}
}
