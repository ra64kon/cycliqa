/**
 * Multi-mode entry point: process_control component server.
 * Start with: npm run start:process-control  (or dev:process-control)
 * Default port: 3005 (override with PORT env var)
 */
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { initializeDatabase } from "../config/db.js";
import { ENV } from "../config/env.js";
import processControlRoutes from "../components/process_control/routes.js";

const app = new Hono();

app.route("/api/v1/process-control", processControlRoutes);

app.get("/health", (c) =>
  c.json({ status: "ok", component: "process_control", mode: ENV.DEPLOY_MODE, timestamp: new Date().toISOString() })
);

app.notFound((c) => c.json({ error: "Not found" }, 404));

await initializeDatabase();
console.log(`process_control server starting on http://localhost:${ENV.PORT}`);
serve({ fetch: app.fetch, port: ENV.PORT });

export default app;
