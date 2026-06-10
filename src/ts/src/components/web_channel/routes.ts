import { Hono } from "hono";
import { bearerAuth } from "../../middleware/auth.js";
import { createSession, submitOrder, getWebOrderStatus, getWebProcessStatus } from "./service.js";
import { SubmitOrderRequestSchema } from "../../schemas/web_channel.schema.js";

const app = new Hono();

/**
 * POST /api/v1/web-channel/session
 * Issues a short-lived JWT for the web frontend. No prior auth required.
 */
app.post("/session", async (c) => {
  const session = await createSession();
  return c.json(session);
});

/**
 * POST /api/v1/web-channel/orders
 * Submits a new order and triggers the brewing process. Requires JWT.
 */
app.post("/orders", bearerAuth, async (c) => {
  try {
    const body = await c.req.json();
    const parsed = SubmitOrderRequestSchema.safeParse(body);
    if (!parsed.success) {
      c.status(400);
      return c.json({ error: parsed.error.issues[0]?.message ?? "Invalid request body" });
    }
    const authToken = c.req.header("Authorization") ?? "";
    const result = await submitOrder(parsed.data, authToken);
    c.status(201);
    return c.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    c.status(400);
    return c.json({ error: message });
  }
});

/**
 * GET /api/v1/web-channel/orders/:orderId
 * Returns the current status of an order. Requires JWT.
 */
app.get("/orders/:orderId", bearerAuth, async (c) => {
  try {
    const orderId = c.req.param("orderId");
    const authToken = c.req.header("Authorization") ?? "";
    const result = await getWebOrderStatus(orderId, authToken);
    return c.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const isNotFound = message.startsWith("Order not found");
    c.status(isNotFound ? 404 : 400);
    return c.json({ error: message });
  }
});

/**
 * GET /api/v1/web-channel/processes/:processId
 * Returns the live process status. Requires JWT.
 */
app.get("/processes/:processId", bearerAuth, async (c) => {
  try {
    const processId = c.req.param("processId");
    const authToken = c.req.header("Authorization") ?? "";
    const result = await getWebProcessStatus(processId, authToken);
    return c.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const isNotFound = message.startsWith("Process not found");
    c.status(isNotFound ? 404 : 400);
    return c.json({ error: message });
  }
});

export default app;
