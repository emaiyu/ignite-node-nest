import { Entity } from '@/core/entities/entity';
import type { UniqueEntityId } from '@/core/entities/unique-entity-id';

interface Props {
	name: string;
	email: string;
	password: string;
}

export class Student extends Entity<Props> {
	get name(): string {
		return this.props.name;
	}

	get email(): string {
		return this.props.email;
	}

	get password(): string {
		return this.props.password;
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

export { Props as StudentProps };
