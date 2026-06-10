import { Hono } from "hono";
import { bearerAuth } from "../../middleware/auth.js";
import { grindBeans, prepareCoffee, frothMilk } from "./service.js";
import { OrderStepRequestSchema } from "../../schemas/brewing_station.schema.js";

const app = new Hono();

app.use("*", bearerAuth);

app.post("/grind", async (c) => {
  const body = await c.req.json();
  const parsed = OrderStepRequestSchema.safeParse(body);
  if (!parsed.success) {
    c.status(400);
    return c.json({ error: parsed.error.issues[0]?.message ?? "Invalid request body" });
  }
  return c.json(grindBeans(parsed.data.order_id));
});

app.post("/prepare", async (c) => {
  const body = await c.req.json();
  const parsed = OrderStepRequestSchema.safeParse(body);
  if (!parsed.success) {
    c.status(400);
    return c.json({ error: parsed.error.issues[0]?.message ?? "Invalid request body" });
  }
  return c.json(prepareCoffee(parsed.data.order_id));
});

app.post("/froth-milk", async (c) => {
  const body = await c.req.json();
  const parsed = OrderStepRequestSchema.safeParse(body);
  if (!parsed.success) {
    c.status(400);
    return c.json({ error: parsed.error.issues[0]?.message ?? "Invalid request body" });
  }
  return c.json(frothMilk(parsed.data.order_id));
});

export default app;
