import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification';
import { CurrentUser } from '@/infra/authentication/current-user-decorator';
import { UserPayload } from '@/infra/authentication/jwt.strategy';
import {
	BadRequestException,
	Controller,
	HttpCode,
	Param,
	Patch,
} from '@nestjs/common';

@Controller('/notifications/:notificationId/read')
export class ReadNotificationController {
	constructor(private readNotification: ReadNotificationUseCase) {}

	@Patch()
	@HttpCode(204)
	async handle(
		@CurrentUser() user: UserPayload,
		@Param('notificationId') notificationId: string,
	): Promise<void> {
		const result = await this.readNotification.execute({
			notificationId,
			recipientId: user.sub,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
