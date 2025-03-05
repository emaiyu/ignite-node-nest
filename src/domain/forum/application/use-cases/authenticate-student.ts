import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Encrypter } from '../cryptography/encrypter';
import { HashComparer } from '../cryptography/hash-comparer';
import { StudentRepository } from '../repositories/student-repository';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

interface AuthenticateStudentPayload {
	email: string;
	password: string;
}

type AuthenticateStudentResult = Either<
	WrongCredentialsError,
	{
		accessToken: string;
	}
>;

@Injectable()
export class AuthenticateStudentUseCase {
	constructor(
		private studentRepository: StudentRepository,
		private hashComparer: HashComparer,
		private encrypter: Encrypter,
	) {}

	async execute({
		email,
		password,
	}: AuthenticateStudentPayload): Promise<AuthenticateStudentResult> {
		const student = await this.studentRepository.findByEmail(email);

		if (!student) {
			return left(new WrongCredentialsError());
		}

		const isPasswordValid = await this.hashComparer.compare(
			password,
			student.password,
		);

		if (!isPasswordValid) {
			return left(new WrongCredentialsError());
		}

		const accessToken = await this.encrypter.encrypt({
			sub: student.id.toString(),
		});

		return right({
			accessToken,
		});
	}
}
