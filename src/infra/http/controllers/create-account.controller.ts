import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exists-error';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { Public } from '@/infra/authentication/public';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	Post,
	UsePipes,
} from '@nestjs/common';
import { z } from 'zod';

const BodySchema = z.object({
	name: z.string(),
	email: z.string(),
	password: z.string(),
});

type BodyPayload = z.infer<typeof BodySchema>;

@Controller('/accounts')
@Public()
export class CreateAccountController {
	constructor(private readonly useCase: RegisterStudentUseCase) {}

	// @HttpCode(201)
	@Post()
	@UsePipes(new ZodValidationPipe(BodySchema))
	async handle(@Body() body: BodyPayload): Promise<void> {
		const { name, email, password } = body;

		const result = await this.useCase.execute({
			name,
			email,
			password,
		});

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				case StudentAlreadyExistsError:
					throw new ConflictException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}
	}
}
