import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment-repository';
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository';
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository';
import { AttachmentRepository } from '@/domain/forum/application/repositories/attachment-repository';
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository';
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository';
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository';
import { StudentRepository } from '@/domain/forum/application/repositories/student-repository';
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaAnswerAttachmentRepository } from './prisma/repositories/prisma-answer-attachment-repository';
import { PrismaAnswerCommentRepository } from './prisma/repositories/prisma-answer-comment-repository';
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answer-repository';
import { PrismaAttachmentRepository } from './prisma/repositories/prisma-attachment-repository';
import { PrismaQuestionAttachmentRepository } from './prisma/repositories/prisma-question-attachment-repository';
import { PrismaQuestionCommentRepository } from './prisma/repositories/prisma-question-comment-repository';
import { PrismaQuestionRepository } from './prisma/repositories/prisma-question-repository';
import { PrismaStudentRepository } from './prisma/repositories/prisma-student-repository';

@Module({
	providers: [
		PrismaService,
		{
			provide: QuestionRepository,
			useClass: PrismaQuestionRepository,
		},
		{
			provide: QuestionCommentRepository,
			useClass: PrismaQuestionCommentRepository,
		},
		{
			provide: QuestionAttachmentRepository,
			useClass: PrismaQuestionAttachmentRepository,
		},
		{
			provide: AnswerRepository,
			useClass: PrismaAnswerRepository,
		},
		{
			provide: AnswerCommentRepository,
			useClass: PrismaAnswerCommentRepository,
		},
		{
			provide: AnswerAttachmentRepository,
			useClass: PrismaAnswerAttachmentRepository,
		},
		{
			provide: StudentRepository,
			useClass: PrismaStudentRepository,
		},
		{
			provide: AttachmentRepository,
			useClass: PrismaAttachmentRepository,
		},
	],
	exports: [
		PrismaService,
		QuestionRepository,
		QuestionCommentRepository,
		QuestionAttachmentRepository,
		AnswerRepository,
		AnswerCommentRepository,
		AnswerAttachmentRepository,
		StudentRepository,
		AttachmentRepository,
	],
})
export class DatabaseModule {}
