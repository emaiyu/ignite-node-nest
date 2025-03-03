import { Env } from '@/env';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { z } from 'zod';

const Schema = z.object({
	sub: z.string().uuid(),
});

type Payload = z.infer<typeof Schema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(config: ConfigService<Env, true>) {
		const publicKey = config.get('APP_PUBLIC_KEY', { infer: true });
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: Buffer.from(publicKey, 'base64'),
			algorithms: ['RS256'],
		});
	}

	validate(payload: Payload): {
		sub: string;
	} {
		return Schema.parse(payload);
	}
}

export { Payload as UserPayload };
