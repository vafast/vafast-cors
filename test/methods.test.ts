import { Server, createHandler } from 'vafast'
import { cors } from '../src'

import { describe, expect, it } from 'vitest'
import { req, preflight } from './utils'

describe('Methods', () => {
	it('Accept single methods', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: createHandler(() => {
					return 'HI'
				}),
				middleware: [
					cors({
						methods: 'GET'
					})
				]
			}
		])

		const res = await app.fetch(req('/'))
		expect(res.headers.get('Access-Control-Allow-Methods')).toBe('GET')
	})

	it('Accept array', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: createHandler(() => {
					return 'HI'
				}),
				middleware: [
					cors({
						methods: ['GET', 'POST']
					})
				]
			}
		])

		const res = await app.fetch(req('/'))
		expect(res.headers.get('Access-Control-Allow-Methods')).toBe(
			'GET, POST'
		)
	})

	it('Accept *', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: createHandler(() => {
					return 'HI'
				}),
				middleware: [
					cors({
						methods: '*'
					})
				]
			}
		])

		const res = await app.fetch(req('/'))
		expect(res.headers.get('Access-Control-Allow-Methods')).toBe('*')
	})

	it('Mirror request method if set to true', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: createHandler(() => {
					return 'HI'
				}),
				middleware: [cors()]
			},
			{
				method: 'POST',
				path: '/',
				handler: createHandler(() => {
					return 'HI'
				}),
				middleware: [cors()]
			}
		])

		const get = await app.fetch(req('/'))
		expect(get.headers.get('Access-Control-Allow-Methods')).toBe('GET')
	})

	it('Handle mirror method on preflight options', async () => {
		const app = new Server([
			{
				method: 'OPTIONS',
				path: '/',
				handler: createHandler(() => {
					return {
						status: 204
					}
				}),
				middleware: [cors()]
			},
			{
				method: 'GET',
				path: '/',
				handler: createHandler(() => {
					return 'HI'
				}),
				middleware: [cors()]
			}
		])

		const get = await app.fetch(
			preflight('/', {
				origin: 'http://localhost/',
				'access-control-request-method': 'PUT'
			})
		)
		expect(get.headers.get('Access-Control-Allow-Methods')).toBe('PUT')
	})
})
