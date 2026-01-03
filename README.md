# @vafast/cors

CORS middleware plugin for [Vafast](https://github.com/vafastjs/vafast) framework.

## Installation

```bash
bun add @vafast/cors
# or
npm install @vafast/cors
```

## Example

```typescript
import { Server, createHandler } from 'vafast'
import { cors } from '@vafast/cors'

const server = new Server([
  {
    method: 'GET',
    path: '/',
    handler: createHandler(() => 'Hello World'),
    middleware: [cors()]
  }
])

export default {
  fetch: (req: Request) => server.fetch(req)
}
```

## Configuration

### origin

@default `true`

Assign the **Access-Control-Allow-Origin** header.

Value can be one of the following:
- `string` - String of origin which will directly assign to `Access-Control-Allow-Origin`

- `boolean` - If set to true, `Access-Control-Allow-Origin` will be set to the request origin (accept all origin)

- `RegExp` - Pattern to use to test with request's url, will accept origin if matched.

- `Function` - Custom logic to validate origin acceptance or not. will accept origin if `true` is returned.
    ```typescript
    // Example usage
    cors({
        origin: (request: Request) => {
            const origin = request.headers.get('Origin')
            return origin === 'https://example.com'
        }
    })
    ```

- `Array<string | RegExp | Function>` - Will try to find truthy value of all options above. Will accept Request if one is `true`.

### methods

@default `true`

Assign **Access-Control-Allow-Methods** header. 

Value can be one of the following:
- `undefined | null | ''` - Ignore all methods.

- `true` - Mirror the request method.

- `*` - Accept all methods.

- `HTTPMethod` - Will be directly set to **Access-Control-Allow-Methods**.
    - Expects either a single method or a comma-delimited string (eg: 'GET, PUT, POST')

- `HTTPMethod[]` - Allow multiple HTTP methods.
    - eg: ['GET', 'PUT', 'POST']

### allowedHeaders

@default `true`

Assign **Access-Control-Allow-Headers** header. 

Allow incoming request with the specified headers.

Value can be one of the following:
- `true` - Mirror the request headers.

- `string`
    - Expects either a single header or a comma-delimited string (eg: 'Content-Type, Authorization').

- `string[]` - Allow multiple headers.
    - eg: ['Content-Type', 'Authorization']

### exposeHeaders

@default `true`

Assign **Access-Control-Exposed-Headers** header. 

Return the specified headers to request in CORS mode.

Value can be one of the following:
- `true` - Mirror the request headers.

- `string`
    - Expects either a single header or a comma-delimited string (eg: 'Content-Type, X-Powered-By').

- `string[]` - Allow multiple headers.
    - eg: ['Content-Type', 'X-Powered-By']

### credentials

@default `true`

Assign **Access-Control-Allow-Credentials** header. 

Allow incoming requests to send `credentials` header.

- `boolean` - Available if set to `true`.

### maxAge

@default `5`

Assign **Access-Control-Max-Age** header. 

Duration in seconds to indicates how long the results of a preflight request can be cached.

- `number` - Duration in seconds.

### preflight

@default `true`

Automatically handle OPTIONS preflight requests which response with `HTTP 204` and CORS headers.

- `boolean` - Available if set to `true`.

## License

MIT
