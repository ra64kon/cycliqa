/**
 * Multi-mode entry point: order_terminal component server.
 * Start with: npm run start:order-terminal  (or dev:order-terminal)
 * Default port: 3002 (override with PORT env var)
 */
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { initializeDatabase } from "../config/db.js";
import { ENV } from "../config/env.js";
import orderTerminalRoutes from "../components/order_terminal/routes.js";

const app = new Hono();

app.route("/api/v1/orders", orderTerminalRoutes);

app.get("/health", (c) =>
  c.json({ status: "ok", component: "order_terminal", mode: ENV.DEPLOY_MODE, timestamp: new Date().toISOString() })
);

app.notFound((c) => c.json({ error: "Not found" }, 404));

await initializeDatabase();
console.log(`order_terminal server starting on http://localhost:${ENV.PORT}`);
serve({ fetch: app.fetch, port: ENV.PORT });

export default app;
