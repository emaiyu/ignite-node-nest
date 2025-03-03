import { randomUUID } from 'crypto';

export class UniqueEntityId {
	private value: string;

	toString(): string {
		return this.value;
	}

	toValue(): string {
		return this.value;
	}

	constructor(value?: string) {
		this.value = value ?? randomUUID();
	}

	public equals(id: UniqueEntityId): boolean {
		return id.toValue() === this.value;
	}
}
