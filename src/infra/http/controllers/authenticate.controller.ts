import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {
	Body,
	Controller,
	Post,
	UnauthorizedException,
	UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const BodySchema = z.object({
	email: z.string(),
	password: z.string(),
});

type BodyPayload = z.infer<typeof BodySchema>;

@Controller('/sessions')
@UsePipes(new ZodValidationPipe(BodySchema))
export class AuthenticateController {
	constructor(
		private readonly prisma: PrismaService,
		private readonly jwt: JwtService,
	) {}

	@Post()
	async handle(@Body() body: BodyPayload): Promise<{
		access_token: string;
	}> {
		const { email, password } = body;
		const user = await this.prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user)
			throw new UnauthorizedException('User credentials do not match.');

		const isPasswordValid = await compare(password, user.password);

		if (!isPasswordValid)
			throw new UnauthorizedException('User credentials do not match.');

		const accessToken = this.jwt.sign({
			sub: user.id,
		});

		return {
			access_token: accessToken,
		};
	}
}
