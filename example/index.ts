import { Server } from 'tirne'
import { cors } from '../src/index'

const app = new Server([
	{
		method: 'POST',
		path: '/',
		handler: ({ body }) => new Response(body),
		middleware: [
			cors({
				origin: 'http://example.com'
			})
		]
	}
])

app.fetch(
	new Request('http://localhost/awd', {
		headers: {
			origin: 'https://example.com',
			a: 'b',
			c: 'd'
		}
	})
)
	.then((x) => x.headers)
	.then(console.log)
