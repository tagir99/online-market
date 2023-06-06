import {
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { AuthDto } from '../auth/dto/auth.dto'
import { SendMailService } from './send-mail.service'

@Controller('mail')
export class SendMailController {
	constructor(private readonly sendMailService: SendMailService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('forgotPass')
	async login(@Body() dto: AuthDto) {
		return this.sendMailService.login(dto)
	}
}
