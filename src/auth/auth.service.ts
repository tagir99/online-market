import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { hash, verify } from 'argon2'
import { PrismaService } from 'src/prisma.service'
import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService, private jwt: JwtService) {}

	async login(dto: AuthDto) {
		const user = await this.validateUser(dto)
		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	//==--==
	async getNewTokens(refreshToken: string) {
		// В result получаем payload
		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result) throw new UnauthorizedException('avtorization is closed')

		const user = await this.prisma.user.findUnique({
			where: { id: result.id }
		})

		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}
	//==--==

	async register(dto: AuthDto) {
		const oldUser = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		})

		const oldPhone = await this.prisma.user.findUnique({
			where: {
				phone: dto.phone
			}
		})

		const oldEmail = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		})

		if (oldUser || oldPhone || oldEmail)
			throw new BadRequestException('User-email or user-phone already exists')

		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				name: dto.name,
				phone: dto.phone,
				password: await hash(dto.password)
			}
		})

		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	private async issueTokens(userId: number) {
		const data = { id: userId }

		const accessToken = this.jwt.sign(data, {
			expiresIn: '9h'
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '9d'
		})

		return { accessToken, refreshToken }
	}

	private returnUserFields(user: any) {
		return {
			id: user.id,
			email: user.email,
			phone: user.phone
		}
	}

	private async validateUser(dto: AuthDto) {
		// получение юзера
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		})

		if (!user) throw new NotFoundException('User not found')

		const isValid = await verify(user.password, dto.password)

		if (!isValid) throw new UnauthorizedException('invalid password')

		return user
	}
}
