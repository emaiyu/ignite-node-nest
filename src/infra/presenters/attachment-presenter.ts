import type { Attachment } from '@/domain/forum/enterprise/entities/attachment';

export type ToHTTP = {
	id: string;
	title: string;
	url: string;
};
export class AttachmentPresenter {
	static toHTTP(attachment: Attachment): ToHTTP {
		return {
			id: attachment.id.toString(),
			title: attachment.title,
			url: attachment.url,
		};
	}
}
