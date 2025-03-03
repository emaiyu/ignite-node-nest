import { expect, test } from 'vitest';

import type { Either } from './either';
import { left, right } from './either';

function doSomething(shouldSuccess: boolean): Either<string, number> {
	if (shouldSuccess) return right(10);
	return left('error');
}

test('success result', function () {
	const result = doSomething(true);
	if (result.isRight()) {
		console.log(result.value);
	}
	expect(result.isRight()).toEqual(true);
	expect(result.isLeft()).toEqual(false);
});

test('error result', function () {
	const result = doSomething(false);
	expect(result.isRight()).toEqual(false);
	expect(result.isLeft()).toEqual(true);
});
