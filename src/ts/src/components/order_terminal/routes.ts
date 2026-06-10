import { Hono } from "hono";
import { bearerAuth } from "../../middleware/auth.js";
import { placeOrder, getOrderStatus } from "./service.js";
import { PlaceOrderRequestSchema } from "../../schemas/order_terminal.schema.js";

const app = new Hono();

app.use("*", bearerAuth);

/**
 * POST /api/v1/orders
 * Internal write API: creates an order record. Process start is handled by the calling channel.
 */
app.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = PlaceOrderRequestSchema.safeParse(body);
    if (!parsed.success) {
      c.status(400);
      return c.json({ error: parsed.error.issues[0]?.message ?? "Invalid request body" });
    }
    const result = await placeOrder(parsed.data);
    c.status(201);
    return c.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    c.status(400);
    return c.json({ error: message });
  }
});

/**
 * GET /api/v1/orders?order_id=...
 * Returns the current status of an order.
 */
app.get("/", async (c) => {
  try {
    const orderId = c.req.query("order_id");
    if (!orderId) {
      c.status(400);
      return c.json({ error: "Missing query parameter: order_id" });
    }
    const result = await getOrderStatus(orderId);
    return c.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.startsWith("Order not found") ? 404 : 400;
    c.status(status);
    return c.json({ error: message });
  }
});

export default app;
