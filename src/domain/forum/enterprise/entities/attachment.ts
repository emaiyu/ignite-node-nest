import { Entity } from '@/core/entities/entity';
import type { UniqueEntityId } from '@/core/entities/unique-entity-id';

interface Props {
	title: string;
	url: string;
}

export class Attachment extends Entity<Props> {
	get title(): string {
		return this.props.title;
	}

	get url(): string {
		return this.props.url;
	}

	static create(props: Props, id?: UniqueEntityId): Attachment {
		const attachment = new Attachment(
			{
				...props,
			},
			id,
		);
		return attachment;
	}
}

export { Props as AttachmentProps };
