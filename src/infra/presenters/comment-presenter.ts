import type { Comment } from '@/domain/forum/enterprise/entities/comment';
export type ToHTTP = {
	id: string;
	content: string;
	createdAt: Date;
	updatedAt: Date | null | undefined;
};
export class CommentPresenter {
	static toHTTP(comment: Comment<any>): ToHTTP {
		return {
			id: comment.id.toString(),
			content: comment.content,
			createdAt: comment.createdAt,
			updatedAt: comment.updatedAt,
		};
	}
}
