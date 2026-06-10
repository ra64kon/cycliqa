/**
 * Multi-mode entry point: brewing_station component server.
 * Start with: npm run start:brewing-station  (or dev:brewing-station)
 * Default port: 3003 (override with PORT env var)
 */
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { initializeDatabase } from "../config/db.js";
import { ENV } from "../config/env.js";
import brewingStationRoutes from "../components/brewing_station/routes.js";

const app = new Hono();

app.route("/api/v1/brewing", brewingStationRoutes);

app.get("/health", (c) =>
  c.json({ status: "ok", component: "brewing_station", mode: ENV.DEPLOY_MODE, timestamp: new Date().toISOString() })
);

app.notFound((c) => c.json({ error: "Not found" }, 404));

await initializeDatabase();
console.log(`brewing_station server starting on http://localhost:${ENV.PORT}`);
serve({ fetch: app.fetch, port: ENV.PORT });

export default app;
