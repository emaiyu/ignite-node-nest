/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FakeEncrypter } from '@/cryptography/faker-encrypter';
import { FakeHasher } from '@/cryptography/faker-hasher';
import { InMemoryStudentRepository } from '@/repositories/in-memory-student-repository';
import { makeStudent } from 'test/factories/make-student';
import { AuthenticateStudentUseCase } from './authenticate-student';

let inMemoryStudentRepository: InMemoryStudentRepository;
let hasher: FakeHasher;
let encrypter: FakeEncrypter;

let sut: AuthenticateStudentUseCase;

describe('Authenticate Student', () => {
	beforeEach(() => {
		inMemoryStudentRepository = new InMemoryStudentRepository();
		hasher = new FakeHasher();
		encrypter = new FakeEncrypter();

		sut = new AuthenticateStudentUseCase(
			inMemoryStudentRepository,
			hasher,
			encrypter,
		);
	});

	it('should be able to authenticate a student', async () => {
		const student = makeStudent({
			email: 'johndoe@example.com',
			password: await hasher.hash('123456'),
		});

		inMemoryStudentRepository.items.push(student);

		const result = await sut.execute({
			email: 'johndoe@example.com',
			password: '123456',
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			accessToken: expect.any(String),
		});
	});
});
