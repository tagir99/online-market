import { MailerService } from '@nestjs-modules/mailer'
import {
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'argon2'
import { PrismaService } from 'src/prisma.service'
import { AuthDto } from '../auth/dto/auth.dto'

@Injectable()
export class SendMailService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private readonly mailerService: MailerService
	) {}

	async login(dto: AuthDto) {
		const user = await this.validateUser(dto)
		const tokens = await this.issueTokens(user.id)

		if (user) {
			await this.sendMail()
			// |
			return 'send mail'
		}
	}

	async sendMail() {
		let result = ''
		const characters =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
		const charactersLength = characters.length
		let counter = 0
		while (counter < 10) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength))
			counter += 1
		}
		await this.mailerService.sendMail({
			to: 'tagir998@mail.ru', // list of receivers
			from: 'sarifimaja30@gmail.com', // sender address
			subject: 'Testing Nest MailerModule ✔', // Subject line
			text: 'welcome', // plaintext body
			html: `<b>welcome to kosmet-site - ${result}</b>` // HTML body content
		})
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
