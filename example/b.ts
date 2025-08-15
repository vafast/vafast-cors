import { Server } from 'tirne'

const server = new Server([
	{
		method: 'GET',
		path: '/health',
		handler: () => new Response('✅ OK')
	}
])

export default {
	fetch: (req: Request) => server.fetch(req)
}
