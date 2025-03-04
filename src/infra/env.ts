import { z } from 'zod';

export const EnvSchema = z.object({
	APP_PRIVATE_KEY: z.string(),
	APP_PUBLIC_KEY: z.string(),

	DATABASE_URL: z.string().url(),

	DB_USERNAME: z.string(),
	DB_PASSWORD: z.string(),
	DB_DATABASE: z.string(),
	DB_PORT: z.coerce.number().default(5432),

	PORT: z.coerce.number().default(3333),
});

export type Env = z.infer<typeof EnvSchema>;
