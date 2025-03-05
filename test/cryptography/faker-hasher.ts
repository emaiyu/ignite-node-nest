import type { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer';
import type { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';

export class FakeHasher implements HashGenerator, HashComparer {
	async hash(plain: string): Promise<string> {
		return Promise.resolve(plain.concat('-hashed'));
	}

	async compare(plain: string, hash: string): Promise<boolean> {
		return Promise.resolve(plain.concat('-hashed') === hash);
	}
}
