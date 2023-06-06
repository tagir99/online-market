import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from 'src/config/jwt.config'
import { PrismaService } from 'src/prisma.service'
import { AuthController } from '../auth/auth.controller'
import { AuthService } from '../auth/auth.service'
import { JwtStrategy } from '../auth/jwt.strategy'
import { SendMailController } from './send-mail.controller'
import { SendMailService } from './send-mail.service'

@Module({
	controllers: [AuthController, SendMailController],
	providers: [AuthService, JwtStrategy, PrismaService, SendMailService],
	imports: [
		MailerModule.forRoot({
			transport: {
				service: 'gmail',
				host: 'smtp.gmail.com',
				auth: {
					user: 'sarifimaja30@gmail.com',
					pass: 'ljxctthyeeasgpmh'
				}
			}
		}),
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig
		})
	]
})
export class SendMailModule {}
