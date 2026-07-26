# @vafast/cors

Vafast 的 [CORS](https://developer.mozilla.org/docs/Web/HTTP/CORS) 中间件：为响应补充跨域头，并默认自动处理 `OPTIONS` 预检（返回 `204`）。

默认较宽松（任意 Origin、反射方法/头、`credentials: true`），生产请收紧白名单。

## 安装

```bash
npm install @vafast/cors
```

## 快速开始

```typescript
import { Server, defineRoute, defineRoutes, json, serve } from 'vafast'
import { cors } from '@vafast/cors'

const routes = defineRoutes([
  defineRoute({
    method: 'GET',
    path: '/',
    handler: () => json({ ok: true }),
  }),
])

const server = new Server(routes)
server.use(cors())
serve({ fetch: server.fetch, port: 3000 })
```

### `origin: true`（默认）行为

设置 `Vary: *`；`Access-Control-Allow-Origin` 为请求的 `Origin`，若无 `Origin` 则为 `*`。

这样可与默认 `credentials: true` 兼容——浏览器规定：**带凭证时 ACAO 不能是 `*`**，必须是具体源。

生产请改为白名单：

```typescript
server.use(
  cors({
    origin: ['https://example.com', 'https://app.example.com'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 600,
  }),
)
```

## 选项

| 选项 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `origin` | `boolean \| string \| RegExp \| ((req) => boolean \| void) \| 数组` | `true` | 见下方 origin 模式；函数须**显式返回 `true`** 才放行 |
| `methods` | `boolean \| null \| '' \| '*' \| 方法 \| 字符串 \| 数组` | `true` | `true` 时镜像预检/当前方法；`false`/空则不写该头 |
| `allowedHeaders` | `true \| string \| string[]` | `true` | `true` 时预检镜像 `Access-Control-Request-Headers` |
| `exposeHeaders` | `true \| string \| string[]` | `true` | 前端 JS 可读的响应头；`true` 时取请求头名列表 |
| `credentials` | `boolean` | `true` | 写 `Access-Control-Allow-Credentials: true`（预检与实际请求都会） |
| `maxAge` | `number` | — | 预检缓存秒数；**未传不写头**（JSDoc 曾写默认 `5`，源码无默认） |
| `preflight` | `boolean` | `true` | 拦截全部 `OPTIONS`，直接 `204` + CORS 头，不进入后续路由 |

### `origin` 模式速查

| 值 | 行为 |
|----|------|
| `true` | 回显请求 `Origin`（无则 `*`）+ `Vary: *` |
| 字符串 / 字符串数组 | 匹配则回显该 `Origin`（也支持去协议后的 host 比较） |
| `'*'`（在列表中） | ACAO 固定 `*`；**勿与 credentials 同时依赖** |
| `RegExp` | 对 `Origin` 做 `test` |
| 函数 | 返回严格 `true` 才放行 |
| 混合数组 | 任一规则命中即放行 |

## 文档

预检、credentials 与 `*` 冲突等完整说明见站点文档：[CORS 中间件](https://vafast.huyooo.com/middleware/cors.html)（仓库内 `vafast-doc/docs/middleware/cors.md`）。
