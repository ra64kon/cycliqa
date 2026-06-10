import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { initializeDatabase, getDatabase } from "../src/config/db.js";
import { placeOrder } from "../src/components/order_terminal/service.js";
import { deliverOrder, retryDelivery, escalateDelivery } from "../src/components/delivery_robot/service.js";

describe("delivery_robot", () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  beforeEach(async () => {
    const db = await getDatabase();
    db.run("DELETE FROM orders");
    db.run("DELETE FROM delivery_attempts");
  });

  describe("deliverOrder", () => {
    it("should deliver on first attempt", async () => {
      const order = await placeOrder({
        beverage_type: "Espresso",
        with_milk_foam: false,
        customer_name: "Ralf",
      });

      const result = await deliverOrder({ order_id: order.order_id, destination: "Table-3" });
      expect(result.status).toBe("delivered");
      expect(result.attempt_number).toBe(1);
    });

    it("should update order status to delivered", async () => {
      const order = await placeOrder({
        beverage_type: "Cappuccino",
        with_milk_foam: true,
        customer_name: "Anna",
      });

      await deliverOrder({ order_id: order.order_id, destination: "Table-5" });
      const db = await getDatabase();
      const stmt = db.prepare("SELECT status FROM orders WHERE order_id = ?");
      stmt.bind([order.order_id]);
      stmt.step();
      const row = stmt.getAsObject() as { status: string };
      stmt.free();
      expect(row.status).toBe("delivered");
    });
  });

  describe("retryDelivery", () => {
    it("should return failed if max retries exceeded", async () => {
      const order = await placeOrder({
        beverage_type: "Latte Macchiato",
        with_milk_foam: true,
        customer_name: "Max",
      });

      await retryDelivery(order.order_id);
      await retryDelivery(order.order_id);
      await retryDelivery(order.order_id);
      const result = await retryDelivery(order.order_id);

      expect(result.retry_count).toBe(3);
      expect(result.status).toBe("failed");
    });
  });

  describe("escalateDelivery", () => {
    it("should set order status to delivery_escalated", async () => {
      const order = await placeOrder({
        beverage_type: "Espresso",
        with_milk_foam: false,
        customer_name: "Lisa",
      });

      await escalateDelivery(order.order_id, "Robot not available");
      const db = await getDatabase();
      const stmt = db.prepare("SELECT status FROM orders WHERE order_id = ?");
      stmt.bind([order.order_id]);
      stmt.step();
      const row = stmt.getAsObject() as { status: string };
      stmt.free();
      expect(row.status).toBe("delivery_escalated");
    });
  });
});
