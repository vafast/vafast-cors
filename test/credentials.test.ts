import { Server, createHandler } from 'vafast'
import { cors } from '../src'

import { describe, expect, it } from 'bun:test'
import { req } from './utils'

describe('Credentials', () => {
	it('Allow credential', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: createHandler(() => {
					return 'HI'
				}),
				middleware: [
					cors({
						credentials: true
					})
				]
			}
		])

		const res = await app.fetch(req('/'))
		expect(res.headers.get('Access-Control-Allow-Credentials')).toBe('true')
	})

	it('Disallow credential', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: createHandler(() => {
					return 'HI'
				}),
				middleware: [
					cors({
						credentials: false
					})
				]
			}
		])

		const res = await app.fetch(req('/'))
		expect(res.headers.has('access-control-allow-credentials')).toBeFalse()
	})
})
