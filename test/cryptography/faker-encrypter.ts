import type { Encrypter } from '@/domain/forum/application/cryptography/encrypter';

export class FakeEncrypter implements Encrypter {
	async encrypt(payload: Record<string, unknown>): Promise<string> {
		return Promise.resolve(JSON.stringify(payload));
	}
}
