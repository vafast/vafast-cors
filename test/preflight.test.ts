import { Server } from 'tirne'
import { cors } from '../src'

import { describe, expect, it } from 'bun:test'
import { preflight } from './utils'

describe('Preflight', () => {
	it('Enable preflight', async () => {
		const app = new Server([
			{
				method: 'OPTIONS',
				path: '/',
				handler: () => new Response(null, { status: 204 }),
				middleware: [
					cors({
						preflight: true
					})
				]
			},
			{
				method: 'GET',
				path: '/',
				handler: () => new Response('HI'),
				middleware: [
					cors({
						preflight: true
					})
				]
			}
		])

		const res = await app.fetch(preflight('/'))
		expect(res.status).toBe(204)
	})

	it('Enable preflight on sub path', async () => {
		const app = new Server([
			{
				method: 'OPTIONS',
				path: '/nested/deep',
				handler: () => new Response(null, { status: 204 }),
				middleware: [
					cors({
						preflight: true
					})
				]
			},
			{
				method: 'GET',
				path: '/nested/deep',
				handler: () => new Response('HI'),
				middleware: [
					cors({
						preflight: true
					})
				]
			}
		])

		const res = await app.fetch(preflight('/nested/deep'))
		expect(res.status).toBe(204)
	})

	it('Disable preflight', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: () => new Response('HI'),
				middleware: [
					cors({
						preflight: false
					})
				]
			}
		])

		const res = await app.fetch(preflight('/'))
		expect(res.status).toBe(404)
	})
})
