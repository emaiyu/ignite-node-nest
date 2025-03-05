import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/errors/wrong-credentials-error';
import { Public } from '@/infra/authentication/public';
import {
	BadRequestException,
	Body,
	Controller,
	Post,
	UnauthorizedException,
	UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const BodySchema = z.object({
	email: z.string(),
	password: z.string(),
});

type BodyPayload = z.infer<typeof BodySchema>;

@Controller('/sessions')
@Public()
@UsePipes(new ZodValidationPipe(BodySchema))
export class AuthenticateController {
	constructor(private readonly useCase: AuthenticateStudentUseCase) {}

	@Post()
	async handle(@Body() body: BodyPayload): Promise<{
		access_token: string;
	}> {
		const { email, password } = body;
		const result = await this.useCase.execute({
			email,
			password,
		});

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				case WrongCredentialsError:
					throw new UnauthorizedException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		const { accessToken } = result.value;

		return {
			access_token: accessToken,
		};
	}
}
