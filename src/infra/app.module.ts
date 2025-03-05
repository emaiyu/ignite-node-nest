import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import { EnvSchema } from './env/env';
import { EventsModule } from './http/events/events.module';
import { HttpModule } from './http/http.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			validate: (env) => EnvSchema.parse(env),
			isGlobal: true,
		}),
		AuthenticationModule,
		HttpModule,
		EventsModule,
	],
})
export class AppModule {}
