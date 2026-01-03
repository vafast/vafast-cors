import { Server, createHandler } from 'vafast'
import { cors } from '../src'

import { describe, expect, it } from 'bun:test'
import { req } from './utils'

describe('Origin', () => {
	it('Accept string', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: createHandler(() => {
					return 'A'
				}),
				middleware: [
					cors({
						origin: 'https://saltyaom.com'
					})
				]
			}
		])

		const res = await app.fetch(
			new Request('http://localhost/', {
				headers: {
					origin: 'https://saltyaom.com'
				}
			})
		)

		expect(res.headers.get('Access-Control-Allow-Origin')).toBe(
			'https://saltyaom.com'
		)
	})

	it('Accept boolean', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: createHandler(() => {
					return 'HI'
				}),
				middleware: [
					cors({
						origin: true
					})
				]
			}
		])

		const res = await app.fetch(req('/'))
		expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*')
	})

	it('Accept RegExp', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: createHandler(() => {
					return 'HI'
				}),
				middleware: [
					cors({
						origin: /\.com/g
					})
				]
			}
		])

		const notAllowed = await app.fetch(
			req('/', {
				Origin: 'https://example.org'
			})
		)
		const allowed = await app.fetch(
			req('/', {
				Origin: 'https://example.com'
			})
		)
		expect(notAllowed.headers.get('Access-Control-Allow-Origin')).toBe(null)
		expect(allowed.headers.get('Access-Control-Allow-Origin')).toBe(
			'https://example.com'
		)
	})

	it('Accept Function', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: createHandler(() => {
					return 'HI'
				}),
				middleware: [
					cors({
						origin: () => true
					})
				]
			}
		])

		const res = await app.fetch(
			req('/', {
				Origin: 'https://example.com'
			})
		)
		expect(res.headers.get('Access-Control-Allow-Origin')).toBe(
			'https://example.com'
		)
	})

	it('Accept string[]', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: createHandler(() => {
					return 'A'
				}),
				middleware: [
					cors({
						origin: ['gehenna.sh', 'saltyaom.com']
					})
				]
			}
		])

		const res = await app.fetch(
			new Request('http://localhost/', {
				headers: {
					origin: 'https://saltyaom.com'
				}
			})
		)

		expect(res.headers.get('Access-Control-Allow-Origin')).toBe(
			'https://saltyaom.com'
		)
	})

	it('Accept Function[]', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: createHandler(() => {
					return 'HI'
				}),
				middleware: [
					cors({
						origin: ['https://demo.app', () => false, /.com/g]
					})
				]
			}
		])

		const res = await app.fetch(
			req('/', {
				Origin: 'https://saltyaom.com'
			})
		)
		expect(res.headers.get('Access-Control-Allow-Origin')).toBe(
			'https://saltyaom.com'
		)
	})

	it('strictly check origin not using sub includes', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: createHandler(() => {
					return 'HI'
				}),
				middleware: [
					cors({
						origin: 'https://example.com'
					})
				]
			}
		])

		const notAllowed = await app.fetch(
			req('/', {
				Origin: 'https://sub.example.com'
			})
		)
		const allowed = await app.fetch(
			req('/', {
				Origin: 'https://example.com'
			})
		)
		expect(notAllowed.headers.get('Access-Control-Allow-Origin')).toBe(null)
		expect(allowed.headers.get('Access-Control-Allow-Origin')).toBe(
			'https://example.com'
		)
	})

	it('strictly check protocol', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: createHandler(() => {
					return 'HI'
				}),
				middleware: [
					cors({
						origin: 'http://example.com'
					})
				]
			}
		])

		const notAllowed = await app.fetch(
			req('/', {
				Origin: 'https://example.com'
			})
		)
		const pass = await app.fetch(
			req('/', {
				Origin: 'http://example.com'
			})
		)
		expect(notAllowed.headers.has('access-control-allow-origin')).toBeFalse()
		expect(pass.headers.has('access-control-allow-origin')).toBeTrue()
	})
})
