/* eslint-disable no-case-declarations */
import type { Middleware } from 'vafast'

type Origin = string | RegExp | ((request: Request) => boolean | void)

export type HTTPMethod =
	| 'ACL'
	| 'BIND'
	| 'CHECKOUT'
	| 'CONNECT'
	| 'COPY'
	| 'DELETE'
	| 'GET'
	| 'HEAD'
	| 'LINK'
	| 'LOCK'
	| 'M-SEARCH'
	| 'MERGE'
	| 'MKACTIVITY'
	| 'MKCALENDAR'
	| 'MKCOL'
	| 'MOVE'
	| 'NOTIFY'
	| 'OPTIONS'
	| 'PATCH'
	| 'POST'
	| 'PROPFIND'
	| 'PROPPATCH'
	| 'PURGE'
	| 'PUT'
	| 'REBIND'
	| 'REPORT'
	| 'SEARCH'
	| 'SOURCE'
	| 'SUBSCRIBE'
	| 'TRACE'
	| 'UNBIND'
	| 'UNLINK'
	| 'UNLOCK'
	| 'UNSUBSCRIBE'

type MaybeArray<T> = T | T[]

interface CORSConfig {
	/**
	 * @default `true`
	 *
	 * Assign the **Access-Control-Allow-Origin** header.
	 *
	 * Value can be one of the following:
	 * - `string` - String of origin which will be directly assign to `Access-Control-Allow-Origin`
	 *
	 * - `boolean` - If set to true, `Access-Control-Allow-Origin` will be set to `*` (accept all origin)
	 *
	 * - `RegExp` - Pattern to use to test with request's url, will accept origin if matched.
	 *
	 * - `Function` - Custom logic to validate origin acceptance or not. will accept origin if `true` is returned.
	 *   - Function will accepts `Request` as parameter
	 *
	 *   ```typescript
	 *   // ? Example usage
	 *   const corsMiddleware = cors({
	 *      origin: (request) => true
	 *   })
	 *
	 *   // Type Definition
	 *   type CORSOriginFn = (request: Request) => boolean | void
	 *   ```
	 *
	 * - `Array<string | RegExp | Function>` - Will try to find truthy value of all options above. Will accept request if one is `true`.
	 */
	origin?: Origin | boolean | Origin[]
	/**
	 * @default `*`
	 *
	 * Assign **Access-Control-Allow-Methods** header.
	 *
	 * Value can be one of the following:
	 * Accept:
	 * - `undefined | null | ''` - Ignore all methods.
	 *
	 * - `*` - Accept all methods.
	 *
	 * - `HTTPMethod` - Will be directly set to **Access-Control-Allow-Methods**.
	 * - Expects either a single method or a comma-delimited string (eg: 'GET, PUT, POST')
	 *
	 * - `HTTPMethod[]` - Allow multiple HTTP methods.
	 * - eg: ['GET', 'PUT', 'POST']
	 */
	methods?:
		| boolean
		| undefined
		| null
		| ''
		| '*'
		| MaybeArray<HTTPMethod | (string & {})>
	/**
	 * @default `*`
	 *
	 * Assign **Access-Control-Allow-Headers** header.
	 *
	 * Allow incoming request with the specified headers.
	 *
	 * Value can be one of the following:
	 * - `string`
	 *     - Expects either a single method or a comma-delimited string (eg: 'Content-Type, Authorization').
	 *
	 * - `string[]` - Allow multiple HTTP methods.
	 *     - eg: ['Content-Type', 'Authorization']
	 */
	allowedHeaders?: true | string | string[]
	/**
	 * @default `*`
	 *
	 * Assign **Access-Control-Expose-Headers** header.
	 *
	 * Return the specified headers to request in CORS mode.
	 *
	 * Value can be one of the following:
	 * - `string`
	 *     - Expects either a single method or a comma-delimited string (eg: 'Content-Type, 'X-Powered-By').
	 *
	 * - `string[]` - Allow multiple HTTP methods.
	 *     - eg: ['Content-Type', 'X-Powered-By']
	 */
	exposeHeaders?: true | string | string[]
	/**
	 * @default `true`
	 *
	 * Assign **Access-Control-Allow-Credentials** header.
	 *
	 * Allow incoming requests to send `credentials` header.
	 *
	 * - `boolean` - Available if set to `true`.
	 */
	credentials?: boolean
	/**
	 * @default `5`
	 *
	 * Assign **Access-Control-Max-Age** header.
	 *
	 * Allow incoming requests to send `credentials` header.
	 *
	 * - `number` - Duration in seconds to indicates how long the results of a preflight request can be cached.
	 */
	maxAge?: number
	/**
	 * @default `true`
	 *
	 * Add `[OPTIONS] /*` handler to handle preflight request which response with `HTTP 204` and CORS hints.
	 *
	 * - `boolean` - Available if set to `true`.
	 */
	preflight?: boolean
}

// @ts-ignore
const isBun = typeof new Headers()?.toJSON === 'function'

/**
 * This function is use when headers config is true.
 * Attempts to process headers based on request headers.
 */
const processHeaders = (headers: any) => {
	// Check if toJSON method exists (Bun specific)
	if ('toJSON' in headers && typeof headers.toJSON === 'function') {
		return Object.keys(headers.toJSON()).join(', ')
	}

	let keys = ''

	let i = 0
	headers.forEach((_: any, key: string) => {
		if (i) keys = keys + ', ' + key
		else keys = key

		i++
	})

	return keys
}

export const cors = (config?: CORSConfig): Middleware => {
	let {
		origin = true,
		methods = true,
		allowedHeaders = true,
		exposeHeaders = true,
		credentials = true,
		maxAge = 5,
		preflight = true
	} = config ?? {}

	if (Array.isArray(allowedHeaders))
		allowedHeaders = allowedHeaders.join(', ')

	if (Array.isArray(exposeHeaders)) exposeHeaders = exposeHeaders.join(', ')

	const origins =
		typeof origin === 'boolean'
			? undefined
			: Array.isArray(origin)
			? origin
			: [origin]

	const anyOrigin = origins?.some((o) => o === '*')

	const originMap = <Record<string, true>>{}
	if (origins)
		for (const origin of origins)
			if (typeof origin === 'string') originMap[origin] = true

	const processOrigin = (
		origin: Origin,
		request: Request,
		from: string
	): boolean => {
		if (Array.isArray(origin))
			return origin.some((o) => processOrigin(o, request, from))

		switch (typeof origin) {
			case 'string':
				if (from in originMap) return true

				const fromProtocol = from.indexOf('://')
				if (fromProtocol !== -1) from = from.slice(fromProtocol + 3)

				return origin === from

			case 'function':
				return origin(request) === true

			case 'object':
				if (origin instanceof RegExp) return origin.test(from)
		}

		return false
	}

	const handleOrigin = (response: Response, request: Request) => {
		// origin === `true` means any origin
		if (origin === true) {
			response.headers.set('vary', '*')
			response.headers.set(
				'access-control-allow-origin',
				request.headers.get('Origin') || '*'
			)

			return
		}

		if (anyOrigin) {
			response.headers.set('vary', '*')
			response.headers.set('access-control-allow-origin', '*')

			return
		}

		if (!origins?.length) return

		const headers: string[] = []

		if (origins.length) {
			const from = request.headers.get('Origin') ?? ''
			for (let i = 0; i < origins.length; i++) {
				const value = processOrigin(origins[i]!, request, from)
				if (value === true) {
					response.headers.set('vary', origin ? 'Origin' : '*')
					response.headers.set(
						'access-control-allow-origin',
						from || '*'
					)

					return
				}
			}
		}

		response.headers.set('vary', 'Origin')
		if (headers.length)
			response.headers.set(
				'access-control-allow-origin',
				headers.join(', ')
			)
	}

	const handleMethod = (response: Response, method?: string | null) => {
		if (!method) return

		if (methods === true)
			return response.headers.set(
				'access-control-allow-methods',
				method ?? '*'
			)

		if (methods === false || !methods?.length) return

		if (methods === '*')
			return response.headers.set('access-control-allow-methods', '*')

		if (!Array.isArray(methods))
			return response.headers.set('access-control-allow-methods', methods)

		response.headers.set('access-control-allow-methods', methods.join(', '))
	}

	const setDefaultHeaders = (response: Response) => {
		if (typeof exposeHeaders === 'string')
			response.headers.set('access-control-expose-headers', exposeHeaders)

		if (typeof allowedHeaders === 'string')
			response.headers.set('access-control-allow-headers', allowedHeaders)

		if (credentials === true)
			response.headers.set('access-control-allow-credentials', 'true')
	}

	const handlePreflight = async (request: Request): Promise<Response> => {
		const response = new Response(null, { status: 204 })

		handleOrigin(response, request)
		handleMethod(
			response,
			request.headers.get('access-control-request-method')
		)

		if (allowedHeaders === true || exposeHeaders === true) {
			if (allowedHeaders === true)
				response.headers.set(
					'access-control-allow-headers',
					request.headers.get('access-control-request-headers') || ''
				)

			if (exposeHeaders === true)
				response.headers.set(
					'access-control-expose-headers',
					processHeaders(request.headers)
				)
		}

		if (maxAge)
			response.headers.set('access-control-max-age', maxAge.toString())

		return response
	}

	return async (request: Request, next: () => Promise<Response>) => {
		// Handle preflight requests
		if (preflight && request.method === 'OPTIONS') {
			const response = new Response(null, { status: 204 })

			handleOrigin(response, request)
			handleMethod(
				response,
				request.headers.get('access-control-request-method')
			)

			if (allowedHeaders === true || exposeHeaders === true) {
				if (allowedHeaders === true)
					response.headers.set(
						'access-control-allow-headers',
						request.headers.get('access-control-request-headers') ||
							''
					)

				if (exposeHeaders === true)
					response.headers.set(
						'access-control-expose-headers',
						processHeaders(request.headers)
					)
			}

			if (maxAge)
				response.headers.set(
					'access-control-max-age',
					maxAge.toString()
				)

			return response
		}

		// Process CORS for actual requests
		const response = await next()

		handleOrigin(response, request)
		handleMethod(response, request.method)
		setDefaultHeaders(response)

		if (allowedHeaders === true || exposeHeaders === true) {
			const headers = processHeaders(request.headers)

			if (allowedHeaders === true)
				response.headers.set('access-control-allow-headers', headers)

			if (exposeHeaders === true)
				response.headers.set('access-control-expose-headers', headers)
		}

		return response
	}
}

export default cors
