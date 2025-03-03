import { Entity } from '@/core/entities/entity';
import type { UniqueEntityId } from '@/core/entities/unique-entity-id';

interface Props {
	name: string;
}

export class Student extends Entity<Props> {
	get name(): string {
		return this.props.name;
	}

	static create(props: Props, id?: UniqueEntityId): Student {
		const student = new Student(
			{
				...props,
			},
			id,
		);
		return student;
	}
}
