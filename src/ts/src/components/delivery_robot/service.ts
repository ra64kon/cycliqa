import { getDatabase } from "../../config/db.js";
import type { DeliveryResponse, RetryDeliveryResponse, EscalateDeliveryResponse, DeliverOrderRequest, DeliveryStatus } from "./types.js";

const MAX_RETRIES = 3;

async function getAttemptCount(orderId: string): Promise<number> {
  const db = await getDatabase();
  const stmt = db.prepare("SELECT COUNT(*) as count FROM delivery_attempts WHERE order_id = ?");
  stmt.bind([orderId]);
  if (!stmt.step()) {
    stmt.free();
    return 0;
  }
  const row = stmt.getAsObject() as { count: number };
  stmt.free();
  return row.count;
}

async function recordAttempt(orderId: string, attemptNumber: number, status: DeliveryStatus, failureReason?: string): Promise<void> {
  const db = await getDatabase();
  db.run(
    "INSERT INTO delivery_attempts (order_id, attempt_number, status, failure_reason) VALUES (?, ?, ?, ?)",
    [orderId, attemptNumber, status, failureReason ?? null]
  );
}

export async function deliverOrder(request: DeliverOrderRequest): Promise<DeliveryResponse> {
  const attemptCount = await getAttemptCount(request.order_id);
  const attemptNumber = attemptCount + 1;
  const success = attemptNumber <= 2;

  if (success) {
    await recordAttempt(request.order_id, attemptNumber, "delivered");
    const db = await getDatabase();
    db.run("UPDATE orders SET status = 'delivered', updated_at = datetime('now') WHERE order_id = ?", [request.order_id]);
    return { order_id: request.order_id, status: "delivered", attempt_number: attemptNumber };
  }

  await recordAttempt(request.order_id, attemptNumber, "failed", "Simulated delivery failure");
  return { order_id: request.order_id, status: "failed", attempt_number: attemptNumber };
}

export async function retryDelivery(orderId: string): Promise<RetryDeliveryResponse> {
  const retryCount = await getAttemptCount(orderId);
  if (retryCount >= MAX_RETRIES) {
    return { order_id: orderId, status: "failed", retry_count: retryCount };
  }
  const newAttemptNumber = retryCount + 1;
  const success = true;
  await recordAttempt(orderId, newAttemptNumber, success ? "delivered" : "failed");
  if (success) {
    const db = await getDatabase();
    db.run("UPDATE orders SET status = 'delivered', updated_at = datetime('now') WHERE order_id = ?", [orderId]);
  }
  return { order_id: orderId, status: success ? "delivered" : "failed", retry_count: newAttemptNumber };
}

export async function escalateDelivery(orderId: string, failureReason: string): Promise<EscalateDeliveryResponse> {
  const attemptCount = await getAttemptCount(orderId);
  await recordAttempt(orderId, attemptCount, "escalated", failureReason);
  const db = await getDatabase();
  db.run("UPDATE orders SET status = 'delivery_escalated', updated_at = datetime('now') WHERE order_id = ?", [orderId]);
  return { order_id: orderId, status: "escalated", failure_reason: failureReason };
}
