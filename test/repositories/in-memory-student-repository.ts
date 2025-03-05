import { DomainEvents } from '@/core/events/domain-events';
import type { StudentRepository } from '@/domain/forum/application/repositories/student-repository';
import type { Student } from '@/domain/forum/enterprise/entities/student';

export class InMemoryStudentRepository implements StudentRepository {
	public items: Student[] = [];

	async findByEmail(email: string): Promise<Student | null> {
		const student = this.items.find((item) => item.email === email);

		if (!student) {
			return null;
		}

		return Promise.resolve(student);
	}

	async create(student: Student): Promise<void> {
		this.items.push(student);

		DomainEvents.dispatchEventsForAggregate(student.id);

		return Promise.resolve();
	}
}
