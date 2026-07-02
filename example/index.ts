import { Server, defineRoutes } from 'vafast'
import { cors } from '../src/index'

const app = new Server(
  defineRoutes([
    {
      method: 'POST',
      path: '/',
      handler: ({ body }) => new Response(String(body)),
      middleware: [
        cors({
          origin: 'http://example.com',
        }),
      ],
    },
  ]),
)

app.fetch(
  new Request('http://localhost/', {
    method: 'POST',
    headers: {
      origin: 'https://example.com',
      a: 'b',
      c: 'd',
    },
    body: 'hello',
  }),
)
  .then(res => res.headers)
  .then(console.log)
