import type { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { Optional } from '@/core/types/optional';

import type { CommentProps } from './comment';
import { Comment } from './comment';

interface Props extends CommentProps {
	answerId: UniqueEntityId;
}

export class AnswerComment extends Comment<Props> {
	get answerId(): UniqueEntityId {
		return this.props.answerId;
	}

	static create(
		props: Optional<Props, 'createdAt'>,
		id?: UniqueEntityId,
	): AnswerComment {
		const answerComment = new AnswerComment(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);
		return answerComment;
	}
}

export { Props as AnswerCommentProps };
