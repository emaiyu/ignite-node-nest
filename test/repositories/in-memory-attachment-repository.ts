import type { AttachmentRepository } from '@/domain/forum/application/repositories/attachment-repository';
import type { Attachment } from '@/domain/forum/enterprise/entities/attachment';

export class InMemoryAttachmentsRepository implements AttachmentRepository {
	public items: Attachment[] = [];

	async create(attachment: Attachment): Promise<void> {
		this.items.push(attachment);
		return Promise.resolve();
	}
}
