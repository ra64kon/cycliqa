/**
 * Single-mode entry point — all components run in one process on one port.
 * Start with: npm run dev  or  npm start
 * Default port: 3000 (override with PORT env var or deploy/single/.env)
 */
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { initializeDatabase } from "./config/db.js";
import { ENV } from "./config/env.js";
import orderTerminalRoutes from "./components/order_terminal/routes.js";
import brewingStationRoutes from "./components/brewing_station/routes.js";
import deliveryRobotRoutes from "./components/delivery_robot/routes.js";
import processControlRoutes from "./components/process_control/routes.js";
import webChannelRoutes from "./components/web_channel/routes.js";

const app = new Hono();

// ─── Internal component APIs (Bearer JWT protected) ───────────────────────────
app.route("/api/v1/orders", orderTerminalRoutes);
app.route("/api/v1/brewing", brewingStationRoutes);
app.route("/api/v1/delivery", deliveryRobotRoutes);
app.route("/api/v1/process-control", processControlRoutes);

// ─── Public web channel (session endpoint + JWT protected routes) ─────────────
app.route("/api/v1/web-channel", webChannelRoutes);

// ─── Health & UI ───────────────────────────────────────────────────────────────
app.get("/health", (c) =>
  c.json({ status: "ok", mode: ENV.DEPLOY_MODE, timestamp: new Date().toISOString() })
);

const __dirname = dirname(fileURLToPath(import.meta.url));
app.get("/app", (c) => {
  const html = readFileSync(join(__dirname, "..", "public", "app.html"), "utf-8");
  return c.html(html);
});

app.get("/", (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>BrewHub – Single Mode</title>
<style>body{font-family:system-ui,sans-serif;max-width:760px;margin:2rem auto;padding:0 1rem}
h1{color:#2d3748}h2{color:#4a5568;margin-top:1.5rem}
code{background:#edf2f7;padding:.15rem .35rem;border-radius:3px}
table{width:100%;border-collapse:collapse;margin:.5rem 0}
th,td{padding:.45rem .6rem;text-align:left;border-bottom:1px solid #e2e8f0}th{background:#f7fafc}
.btn{display:inline-block;padding:.6rem 1.5rem;background:#3182ce;color:#fff;text-decoration:none;border-radius:6px;margin:.5rem 0}
.tag{display:inline-block;padding:.1rem .4rem;border-radius:9px;font-size:.75rem;font-weight:600}
.pub{background:#c6f6d5;color:#276749}.int{background:#bee3f8;color:#2a4365}</style>
</head>
<body>
<h1>☕ BrewHub</h1>
<p>Mode: <strong>single</strong> — all components on port <strong>${ENV.PORT}</strong></p>
<a class="btn" href="/app">Open Demo App</a>
<h2>Web Channel <span class="tag pub">public</span></h2>
<table>
<tr><th>Method</th><th>Path</th><th>Auth</th></tr>
<tr><td>POST</td><td><code>/api/v1/web-channel/session</code></td><td>none</td></tr>
<tr><td>POST</td><td><code>/api/v1/web-channel/orders</code></td><td>JWT</td></tr>
<tr><td>GET</td><td><code>/api/v1/web-channel/orders/{orderId}</code></td><td>JWT</td></tr>
<tr><td>GET</td><td><code>/api/v1/web-channel/processes/{processId}</code></td><td>JWT</td></tr>
</table>
<h2>Internal Component APIs <span class="tag int">internal</span></h2>
<table>
<tr><th>Method</th><th>Path</th><th>Auth</th></tr>
<tr><td>POST</td><td><code>/api/v1/orders</code></td><td>JWT</td></tr>
<tr><td>GET</td><td><code>/api/v1/orders?order_id=…</code></td><td>JWT</td></tr>
<tr><td>POST</td><td><code>/api/v1/brewing/grind</code></td><td>JWT</td></tr>
<tr><td>POST</td><td><code>/api/v1/brewing/prepare</code></td><td>JWT</td></tr>
<tr><td>POST</td><td><code>/api/v1/brewing/froth-milk</code></td><td>JWT</td></tr>
<tr><td>POST</td><td><code>/api/v1/delivery</code></td><td>JWT</td></tr>
<tr><td>POST</td><td><code>/api/v1/delivery/retry</code></td><td>JWT</td></tr>
<tr><td>POST</td><td><code>/api/v1/delivery/escalate</code></td><td>JWT</td></tr>
<tr><td>POST</td><td><code>/api/v1/process-control/processes</code></td><td>JWT</td></tr>
<tr><td>GET</td><td><code>/api/v1/process-control/processes/{id}</code></td><td>JWT</td></tr>
<tr><td>GET</td><td><code>/health</code></td><td>none</td></tr>
</table>
</body></html>`);
});

app.notFound((c) => c.json({ error: "Not found" }, 404));

// ─── Startup ──────────────────────────────────────────────────────────────────
await initializeDatabase();
console.log(`BrewHub (single mode) starting on http://localhost:${ENV.PORT}`);
serve({ fetch: app.fetch, port: ENV.PORT });

export default app;
