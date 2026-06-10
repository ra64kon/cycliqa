import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { initializeDatabase, getDatabase } from "../src/config/db.js";
import { startOrderProcess, getProcessStatus } from "../src/components/process_control/service.js";

describe("process_control", () => {
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

  describe("startOrderProcess", () => {
    it("should create a process instance", async () => {
      const result = await startOrderProcess({
        order_id: "ORDER-001",
        beverage_type: "Cappuccino",
        with_milk_foam: true,
      });

      expect(result.process_id).toMatch(/^PROC-/);
      expect(result.order_id).toBe("ORDER-001");
      expect(result.process_status).toBe("running");
    });

    it("should persist process in database", async () => {
      const result = await startOrderProcess({
        order_id: "ORDER-002",
        beverage_type: "Espresso",
        with_milk_foam: false,
      });

      const db = await getDatabase();
      const stmt = db.prepare("SELECT * FROM process_instances WHERE process_id = ?");
      stmt.bind([result.process_id]);
      stmt.step();
      const row = stmt.getAsObject();
      stmt.free();
      expect(row).toBeTruthy();
      const rowObj = row as unknown as { order_id: string; process_status: string };
      expect(rowObj.order_id).toBe("ORDER-002");
      expect(rowObj.process_status).toBe("running");
    });
  });

  describe("getProcessStatus", () => {
    it("should return process status", async () => {
      const result = await startOrderProcess({
        order_id: "ORDER-003",
        beverage_type: "Latte Macchiato",
        with_milk_foam: false,
      });

      const status = await getProcessStatus(result.process_id);
      expect(status.process_id).toBe(result.process_id);
      expect(status.order_id).toBe("ORDER-003");
      expect(status.process_status).toBe("running");
    });

    it("should throw for non-existent process", async () => {
      await expect(getProcessStatus("PROC-nonexistent")).rejects.toThrow("Process not found");
    });
  });
});
