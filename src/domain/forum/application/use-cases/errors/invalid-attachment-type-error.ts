import type { UseCaseError } from '@/core/errors/use-case';

export class InvalidAttachmentTypeError extends Error implements UseCaseError {
	constructor(type: string) {
		super(`File type "${type}" is not valid.`);
	}
}
