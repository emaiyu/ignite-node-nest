import { FakeHasher } from '@/cryptography/faker-hasher';
import { InMemoryStudentRepository } from '@/repositories/in-memory-student-repository';
import { RegisterStudentUseCase } from './register-student';

let inMemoryStudentRepository: InMemoryStudentRepository;
let hasher: FakeHasher;

let sut: RegisterStudentUseCase;

describe('Register Student', () => {
	beforeEach(() => {
		inMemoryStudentRepository = new InMemoryStudentRepository();
		hasher = new FakeHasher();

		sut = new RegisterStudentUseCase(inMemoryStudentRepository, hasher);
	});

	it('should be able to register a new student', async () => {
		const result = await sut.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456',
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			student: inMemoryStudentRepository.items[0],
		});
	});

	it('should hash student password upon registration', async () => {
		const result = await sut.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456',
		});

		const hashedPassword = await hasher.hash('123456');

		expect(result.isRight()).toBe(true);
		expect(inMemoryStudentRepository.items[0].password).toEqual(hashedPassword);
	});
});
