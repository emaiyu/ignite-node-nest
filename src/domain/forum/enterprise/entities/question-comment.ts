import type { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { Optional } from '@/core/types/optional';

import type { CommentProps } from './comment';
import { Comment } from './comment';

interface Props extends CommentProps {
	questionId: UniqueEntityId;
}

export class QuestionComment extends Comment<Props> {
	get questionId(): UniqueEntityId {
		return this.props.questionId;
	}

	static create(
		props: Optional<Props, 'createdAt'>,
		id?: UniqueEntityId,
	): QuestionComment {
		const questionComment = new QuestionComment(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);
		return questionComment;
	}
}

export { Props as QuestionCommentProps };
