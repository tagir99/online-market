import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from '@prisma/client'

export const CurrentUser = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		const user = request.user
		// из rquest вытаскиваем user, потому что уже прописан user в strategy

		return data ? user[data] : user
	}
)

// https://docs.nestjs.com/fundamentals/execution-context
