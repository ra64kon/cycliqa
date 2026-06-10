import { Hono } from "hono";
import { bearerAuth } from "../../middleware/auth.js";
import { startOrderProcess, getProcessStatus } from "./service.js";
import { StartOrderProcessRequestSchema } from "../../schemas/process_control.schema.js";

const app = new Hono();

app.use("*", bearerAuth);

app.post("/processes", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = StartOrderProcessRequestSchema.safeParse(body);
    if (!parsed.success) {
      c.status(400);
      return c.json({ error: parsed.error.issues[0]?.message ?? "Invalid request body" });
    }
    // Forward the auth token so the orchestrator can use it for downstream HTTP calls in multi-mode.
    const authToken = c.req.header("Authorization") ?? "";
    const result = await startOrderProcess(parsed.data, authToken);
    c.status(201);
    return c.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    c.status(400);
    return c.json({ error: message });
  }
});

app.get("/processes/:processId", async (c) => {
  try {
    const processId = c.req.param("processId");
    const result = await getProcessStatus(processId);
    return c.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.startsWith("Process not found") ? 404 : 400;
    c.status(status);
    return c.json({ error: message });
  }
});

export default app;
