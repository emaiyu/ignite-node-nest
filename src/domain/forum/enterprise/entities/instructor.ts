import { Entity } from '@/core/entities/entity';
import type { UniqueEntityId } from '@/core/entities/unique-entity-id';

interface Props {
	name: string;
}
export class Instructor extends Entity<Props> {
	get name(): string {
		return this.props.name;
	}

	static create(props: Props, id?: UniqueEntityId): Instructor {
		const student = new Instructor(
			{
				...props,
			},
			id,
		);
		return student;
	}
}
