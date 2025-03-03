/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from 'supertest';

describe('Authenticate (E2E)', () => {
	let app: INestApplication;
	let prisma: PrismaService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);

		await app.init();
	});

	test('[POST] /sessions', async () => {
		await prisma.user.create({
			data: {
				name: 'John Doe',
				email: 'johndoe@example.com',
				password: await hash('10203040', 8),
			},
		});

		const response = await request(app.getHttpServer()).post('/sessions').send({
			email: 'johndoe@example.com',
			password: '10203040',
		});

		expect(response.statusCode).toBe(201);
		expect(response.body).toEqual({
			access_token: expect.any(String),
		});
	});
});
