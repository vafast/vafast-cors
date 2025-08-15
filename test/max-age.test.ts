import { Server } from 'tirne'
import { cors } from '../src'

import { describe, expect, it } from 'bun:test'
import { preflight } from './utils'

describe('Max Age', () => {
	it('Set maxage', async () => {
		const app = new Server([
			{
				method: 'OPTIONS',
				path: '/',
				handler: () => new Response(null, { status: 204 }),
				middleware: [
					cors({
						maxAge: 5
					})
				]
			},
			{
				method: 'GET',
				path: '/',
				handler: () => new Response('HI'),
				middleware: [
					cors({
						maxAge: 5
					})
				]
			}
		])

		const res = await app.fetch(preflight('/'))
		expect(res.headers.get('Access-Control-Max-Age')).toBe('5')
	})

	it('Skip maxage if falsey', async () => {
		const app = new Server([
			{
				method: 'OPTIONS',
				path: '/',
				handler: () => new Response(null, { status: 204 }),
				middleware: [
					cors({
						maxAge: 0
					})
				]
			},
			{
				method: 'GET',
				path: '/',
				handler: () => new Response('HI'),
				middleware: [
					cors({
						maxAge: 0
					})
				]
			}
		])

		const res = await app.fetch(preflight('/'))
		expect(res.headers.has('access-control-max-age')).toBeFalse()
	})
})
