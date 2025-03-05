import type { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';

export type ToHTTP = {
	commentId: string;
	authorId: string;
	authorName: string;
	content: string;
	createdAt: Date;
	updatedAt: Date | null | undefined;
};
export class CommentWithAuthorPresenter {
	static toHTTP(commentWithAuthor: CommentWithAuthor): ToHTTP {
		return {
			commentId: commentWithAuthor.commentId.toString(),
			authorId: commentWithAuthor.authorId.toString(),
			authorName: commentWithAuthor.author,
			content: commentWithAuthor.content,
			createdAt: commentWithAuthor.createdAt,
			updatedAt: commentWithAuthor.updatedAt,
		};
	}
}
