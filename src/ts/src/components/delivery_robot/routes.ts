import { Hono } from "hono";
import { bearerAuth } from "../../middleware/auth.js";
import { deliverOrder, retryDelivery, escalateDelivery } from "./service.js";
import {
  DeliverOrderRequestSchema,
  RetryDeliveryRequestSchema,
  EscalateDeliveryRequestSchema,
} from "../../schemas/delivery_robot.schema.js";

const app = new Hono();

app.use("*", bearerAuth);

app.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = DeliverOrderRequestSchema.safeParse(body);
  if (!parsed.success) {
    c.status(400);
    return c.json({ error: parsed.error.issues[0]?.message ?? "Invalid request body" });
  }
  const result = await deliverOrder(parsed.data);
  return c.json(result);
});

app.post("/retry", async (c) => {
  const body = await c.req.json();
  const parsed = RetryDeliveryRequestSchema.safeParse(body);
  if (!parsed.success) {
    c.status(400);
    return c.json({ error: parsed.error.issues[0]?.message ?? "Invalid request body" });
  }
  const result = await retryDelivery(parsed.data.order_id);
  return c.json(result);
});

app.post("/escalate", async (c) => {
  const body = await c.req.json();
  const parsed = EscalateDeliveryRequestSchema.safeParse(body);
  if (!parsed.success) {
    c.status(400);
    return c.json({ error: parsed.error.issues[0]?.message ?? "Invalid request body" });
  }
  const result = await escalateDelivery(parsed.data.order_id, parsed.data.failure_reason);
  return c.json(result);
});

export default app;
