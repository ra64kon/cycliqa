/**
 * Multi-mode entry point: delivery_robot component server.
 * Start with: npm run start:delivery-robot  (or dev:delivery-robot)
 * Default port: 3004 (override with PORT env var)
 */
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { initializeDatabase } from "../config/db.js";
import { ENV } from "../config/env.js";
import deliveryRobotRoutes from "../components/delivery_robot/routes.js";

const app = new Hono();

app.route("/api/v1/delivery", deliveryRobotRoutes);

app.get("/health", (c) =>
  c.json({ status: "ok", component: "delivery_robot", mode: ENV.DEPLOY_MODE, timestamp: new Date().toISOString() })
);

app.notFound((c) => c.json({ error: "Not found" }, 404));

await initializeDatabase();
console.log(`delivery_robot server starting on http://localhost:${ENV.PORT}`);
serve({ fetch: app.fetch, port: ENV.PORT });

export default app;
