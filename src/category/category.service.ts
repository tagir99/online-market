import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CategoryDto } from './category.dto'
import { returnCategoryObject } from './return-category.object'

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}

	// Метод byId будет переиспользоваться
	async byId(id: number) {
		const category = await this.prisma.category.findUnique({
			where: {
				id
			},
			select: returnCategoryObject
		})

		if (!category) {
			throw new Error('category not found')
		}

		return category
	}

	// async bySlug()

	async getAll() {
		return this.prisma.category.findMany({
			select: returnCategoryObject
		})
	}

	async create() {
		return this.prisma.category.create({
			data: {
				name: '',
				slug: ''
			}
		})
	}

	async update(id: number, dto: CategoryDto) {
		const category = await this.byId(id)

		return this.prisma.category.update({
			where: {
				id
			},
			data: {
				name: dto.name

				//slug: dto.slug
			}
		})
	}

	async delete(id: number) {
		return this.prisma.category.delete({
			where: {
				id
			}
		})
	}
}
