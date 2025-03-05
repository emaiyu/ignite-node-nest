import { z } from 'zod';

export const EnvSchema = z.object({
	APP_PRIVATE_KEY: z.string(),
	APP_PUBLIC_KEY: z.string(),

	DATABASE_URL: z.string().url(),

	DB_USERNAME: z.string(),
	DB_PASSWORD: z.string(),
	DB_DATABASE: z.string(),
	DB_PORT: z.coerce.number().default(5432),

	STORAGE_ACCOUNT_ID: z.string(),
	STORAGE_BUCKET_NAME: z.string(),
	STORAGE_ACCESS_KEY_ID: z.string(),
	STORAGE_SECRET_ACCESS_KEY: z.string(),

	PORT: z.coerce.number().default(3333),

	REDIS_HOST: z.string().optional().default('127.0.0.1'),
	REDIS_PORT: z.coerce.number().optional().default(6379),
	REDIS_DB: z.coerce.number().optional().default(0),
});

export type Env = z.infer<typeof EnvSchema>;
