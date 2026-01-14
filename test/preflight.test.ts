import { Server, defineRoute, defineRoutes, empty } from 'vafast'
import { cors } from '../src'

import { describe, expect, it } from 'vitest'
import { preflight } from './utils'

describe('Preflight', () => {
	it('Enable preflight', async () => {
		const app = new Server(
			defineRoutes([
				defineRoute({
					method: 'OPTIONS',
					path: '/',
					handler: () => empty(204),
					middleware: [
						cors({
							preflight: true
						})
					]
				}),
				defineRoute({
					method: 'GET',
					path: '/',
					handler: () => 'HI',
					middleware: [
						cors({
							preflight: true
						})
					]
				})
			])
		)

		const res = await app.fetch(preflight('/'))
		expect(res.status).toBe(204)
	})

	it('Enable preflight on sub path', async () => {
		const app = new Server(
			defineRoutes([
				defineRoute({
					method: 'OPTIONS',
					path: '/nested/deep',
					handler: () => empty(204),
					middleware: [
						cors({
							preflight: true
						})
					]
				}),
				defineRoute({
					method: 'GET',
					path: '/nested/deep',
					handler: () => 'HI',
					middleware: [
						cors({
							preflight: true
						})
					]
				})
			])
		)

		const res = await app.fetch(preflight('/nested/deep'))
		expect(res.status).toBe(204)
	})

	it('Disable preflight', async () => {
		const app = new Server(
			defineRoutes([
				defineRoute({
					method: 'GET',
					path: '/',
					handler: () => 'HI',
					middleware: [
						cors({
							preflight: false
						})
					]
				})
			])
		)

		const res = await app.fetch(preflight('/'))
		// vafast 现在自动处理 OPTIONS 请求，所以期望 204 而不是 405
		expect(res.status).toBe(204)
	})
})
