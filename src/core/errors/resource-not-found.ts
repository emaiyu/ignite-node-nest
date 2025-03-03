import type { UseCaseError } from '@/core/errors/use-case';

export class ResourceNotFoundError extends Error implements UseCaseError {
	constructor() {
		super('Resource not found');
		this.name = 'ResourceNotFoundError';
	}
}
