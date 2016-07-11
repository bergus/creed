import { describe, it } from 'mocha'
import { coroutine, fulfill, reject, delay } from '../src/main'
import assert from 'assert'

describe('coroutine', function () {
	it('should allow parameters', () => {
		const f = coroutine(function *(a, b) {
			assert.equal(a, 'a')
			assert.equal(b, 'b')
		})

		return f('a', 'b')
	})

	it('should continue on fulfilled promises', () => {
		const f = coroutine(function *(a, b) {
			return (yield delay(1, a)) + (yield fulfill(b))
		})

		return f('a', 'b').then(x => assert.equal(x, 'ab'))
	})

	it('should throw on rejected promises', () => {
		const expected = new Error()
		const f = coroutine(function *(a) {
			try {
				yield reject(a)
			} catch (e) {
				return e
			}
		})

		return f(expected)
			.then(x => assert.strictEqual(x, expected))
	})

	it('should reject on uncaught exception', () => {
		const expected = new Error()
		const f = coroutine(function *(a) {
			yield reject(a)
		})

		return f(expected)
			.then(assert.ifError, e => assert.strictEqual(e, expected))
	})
})
