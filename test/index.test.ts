import { Server, defineRoute, defineRoutes } from "vafast";
import { cors } from "../src";

import { describe, expect, it } from "vitest";
import { req } from "./utils";

describe("CORS", () => {
    it("Accept all CORS by default", async () => {
        const app = new Server(
            defineRoutes([
                defineRoute({
                    method: "GET",
                    path: "/",
                    handler: () => "HI",
                    middleware: [cors()]
                })
            ])
        );

        const res = await app.fetch(
            req("/", {
                origin: "https://saltyaom.com",
            }),
        );
        expect(res.headers.get("Access-Control-Allow-Origin")).toBe("https://saltyaom.com");
        expect(res.headers.get("Access-Control-Allow-Methods")).toBe("GET");
        expect(res.headers.get("Access-Control-Allow-Headers")).toBe("origin");
        expect(res.headers.get("Access-Control-Expose-Headers")).toBe(
            "origin",
        );
        expect(res.headers.get("Access-Control-Allow-Credentials")).toBe(
            "true",
        );
    });
});
