/**
 * Multi-mode entry point: web_channel component server.
 * This is the public-facing gateway for the browser frontend.
 * Start with: npm run start:web-channel  (or dev:web-channel)
 * Default port: 3001 (override with PORT env var)
 */
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { ENV } from "../config/env.js";
import webChannelRoutes from "../components/web_channel/routes.js";

const app = new Hono();

app.route("/api/v1/web-channel", webChannelRoutes);

app.get("/health", (c) =>
  c.json({ status: "ok", component: "web_channel", mode: ENV.DEPLOY_MODE, timestamp: new Date().toISOString() })
);

// Serve the demo app UI
const __dirname = dirname(fileURLToPath(import.meta.url));
app.get("/app", (c) => {
  const html = readFileSync(join(__dirname, "../../public", "app.html"), "utf-8");
  return c.html(html);
});

app.get("/", (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>BrewHub – Web Channel</title>
<style>body{font-family:system-ui,sans-serif;max-width:700px;margin:2rem auto;padding:0 1rem}
h1{color:#2d3748}code{background:#edf2f7;padding:.15rem .3rem;border-radius:3px}
table{width:100%;border-collapse:collapse;margin-top:1rem}
th,td{padding:.5rem;text-align:left;border-bottom:1px solid #e2e8f0}
.btn{display:inline-block;padding:.6rem 1.5rem;background:#3182ce;color:#fff;text-decoration:none;border-radius:6px;margin-top:1rem}</style>
</head>
<body>
<h1>BrewHub – Web Channel</h1>
<p>Mode: <strong>${ENV.DEPLOY_MODE}</strong></p>
<a class="btn" href="/app">☕ Open Demo App</a>
<h2>Endpoints</h2>
<table>
<tr><th>Method</th><th>Path</th><th>Auth</th></tr>
<tr><td>POST</td><td><code>/api/v1/web-channel/session</code></td><td>none</td></tr>
<tr><td>POST</td><td><code>/api/v1/web-channel/orders</code></td><td>JWT</td></tr>
<tr><td>GET</td><td><code>/api/v1/web-channel/orders/{orderId}</code></td><td>JWT</td></tr>
<tr><td>GET</td><td><code>/api/v1/web-channel/processes/{processId}</code></td><td>JWT</td></tr>
<tr><td>GET</td><td><code>/health</code></td><td>none</td></tr>
</table>
</body></html>`);
});

app.notFound((c) => c.json({ error: "Not found" }, 404));

console.log(`web_channel server starting on http://localhost:${ENV.PORT}`);
serve({ fetch: app.fetch, port: ENV.PORT });

export default app;
