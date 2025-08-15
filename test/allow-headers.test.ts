import { Server } from 'tirne'
import { cors } from '../src'

import { describe, expect, it } from 'bun:test'
import { req } from './utils'

describe('Allowed Headers', () => {
	it('Accept single header', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: () => new Response('HI'),
				middleware: [
					cors({
						allowedHeaders: 'Content-Type'
					})
				]
			}
		])

		const res = await app.fetch(req('/'))
		expect(res.headers.get('Access-Control-Allow-Headers')).toBe(
			'Content-Type'
		)
	})

	it('Accept array', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: () => new Response('HI'),
				middleware: [
					cors({
						allowedHeaders: ['Content-Type', 'X-Imaginary-Value']
					})
				]
			}
		])

		const res = await app.fetch(req('/'))
		expect(res.headers.get('Access-Control-Allow-Headers')).toBe(
			'Content-Type, X-Imaginary-Value'
		)
	})
})
