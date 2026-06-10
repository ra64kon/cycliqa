import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { initializeDatabase, getDatabase } from "../src/config/db.js";
import { placeOrder, getOrderStatus } from "../src/components/order_terminal/service.js";

describe("order_terminal", () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  beforeEach(async () => {
    const db = await getDatabase();
    db.run("DELETE FROM orders");
    db.run("DELETE FROM process_instances");
    db.run("DELETE FROM process_steps");
    db.run("DELETE FROM delivery_attempts");
  });

  describe("placeOrder", () => {
    it("should create an order with valid input", async () => {
      const result = await placeOrder({
        beverage_type: "Cappuccino",
        with_milk_foam: true,
        customer_name: "Ralf",
      });

      expect(result.order_id).toMatch(/^ORDER-/);
      expect(result.status).toBe("accepted");
      expect(result.beverage_type).toBe("Cappuccino");
      expect(result.with_milk_foam).toBe(true);
      expect(result.customer_name).toBe("Ralf");
    });

    it("should reject invalid beverage types", async () => {
      await expect(
        placeOrder({
          beverage_type: "InvalidDrink" as any,
          with_milk_foam: false,
          customer_name: "Test",
        })
      ).rejects.toThrow(/Invalid beverage_type/);
    });

    it("should create orders for all valid beverage types", async () => {
      const types = ["Espresso", "Cappuccino", "Latte Macchiato"] as const;
      for (const beverageType of types) {
        const result = await placeOrder({
          beverage_type: beverageType,
          with_milk_foam: false,
          customer_name: "Test",
        });
        expect(result.beverage_type).toBe(beverageType);
      }
    });
  });

  describe("getOrderStatus", () => {
    it("should return order status for existing order", async () => {
      const order = await placeOrder({
        beverage_type: "Latte Macchiato",
        with_milk_foam: true,
        customer_name: "Anna",
      });

      const status = await getOrderStatus(order.order_id);
      expect(status.order_id).toBe(order.order_id);
      expect(status.status).toBe("accepted");
      expect(status.beverage_type).toBe("Latte Macchiato");
      expect(status.with_milk_foam).toBe(true);
      expect(status.customer_name).toBe("Anna");
    });

    it("should throw for non-existent order", async () => {
      await expect(getOrderStatus("ORDER-nonexistent")).rejects.toThrow("Order not found");
    });
  });
});
