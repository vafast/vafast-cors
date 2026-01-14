import { Server, defineRoute, defineRoutes, empty } from 'vafast'
import { cors } from '../src'

import { describe, expect, it } from 'vitest'
import { preflight } from './utils'

describe('Max Age', () => {
	it('Set maxage', async () => {
		const app = new Server(
			defineRoutes([
				defineRoute({
					method: 'OPTIONS',
					path: '/',
					handler: () => empty(204),
					middleware: [
						cors({
							maxAge: 5
						})
					]
				}),
				defineRoute({
					method: 'GET',
					path: '/',
					handler: () => 'HI',
					middleware: [
						cors({
							maxAge: 5
						})
					]
				})
			])
		)

		const res = await app.fetch(preflight('/'))
		expect(res.headers.get('Access-Control-Max-Age')).toBe('5')
	})

	it('Skip maxage if falsey', async () => {
		const app = new Server(
			defineRoutes([
				defineRoute({
					method: 'OPTIONS',
					path: '/',
					handler: () => empty(204),
					middleware: [
						cors({
							maxAge: 0
						})
					]
				}),
				defineRoute({
					method: 'GET',
					path: '/',
					handler: () => 'HI',
					middleware: [
						cors({
							maxAge: 0
						})
					]
				})
			])
		)

		const res = await app.fetch(preflight('/'))
		expect(res.headers.has('access-control-max-age')).toBe(false)
	})
})
