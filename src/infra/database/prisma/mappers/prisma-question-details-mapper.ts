import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import type {
	Attachment as PrismaAttachment,
	Question as PrismaQuestion,
	User as PrismaUser,
} from '@prisma/client';
import { PrismaAttachmentMapper } from './prisma-attachment-mapper';

type PrismaQuestionDetails = PrismaQuestion & {
	author: PrismaUser;
	attachments: PrismaAttachment[];
};

export class PrismaQuestionDetailsMapper {
	static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
		return QuestionDetails.create({
			questionId: new UniqueEntityId(raw.id),
			authorId: new UniqueEntityId(raw.author.id),
			author: raw.author.name,
			title: raw.title,
			slug: Slug.create(raw.slug),
			attachments: raw.attachments.map((item) =>
				PrismaAttachmentMapper.toDomain(item),
			),
			bestAnswerId: raw.bestAnswerId
				? new UniqueEntityId(raw.bestAnswerId)
				: null,
			content: raw.content,
			createdAt: raw.createdAt,
			updatedAt: raw.updatedAt,
		});
	}
}
