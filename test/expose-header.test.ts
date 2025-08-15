import { Server } from 'tirne'
import { cors } from '../src'

import { describe, expect, it } from 'bun:test'
import { req } from './utils'

describe('Expose Headers', () => {
	it('Expose single header', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: () => new Response('HI'),
				middleware: [
					cors({
						exposeHeaders: 'Content-Type'
					})
				]
			}
		])

		const res = await app.fetch(req('/'))
		expect(res.headers.get('Access-Control-Expose-Headers')).toBe(
			'Content-Type'
		)
	})

	it('Expose array', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: () => new Response('HI'),
				middleware: [
					cors({
						exposeHeaders: ['Content-Type', 'X-Imaginary-Value']
					})
				]
			}
		])

		const res = await app.fetch(req('/'))
		expect(res.headers.get('Access-Control-Expose-Headers')).toBe(
			'Content-Type, X-Imaginary-Value'
		)
	})
})
