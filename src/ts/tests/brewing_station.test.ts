import { describe, it, expect } from "vitest";
import { grindBeans, prepareCoffee, frothMilk } from "../src/components/brewing_station/service.js";

describe("brewing_station", () => {
  describe("grindBeans", () => {
    it("should return completed status", () => {
      const result = grindBeans("ORDER-123");
      expect(result.order_id).toBe("ORDER-123");
      expect(result.step).toBe("grind_beans");
      expect(result.status).toBe("completed");
    });
  });

  describe("prepareCoffee", () => {
    it("should return completed status", () => {
      const result = prepareCoffee("ORDER-456");
      expect(result.order_id).toBe("ORDER-456");
      expect(result.step).toBe("prepare_coffee");
      expect(result.status).toBe("completed");
    });
  });

  describe("frothMilk", () => {
    it("should return completed status", () => {
      const result = frothMilk("ORDER-789");
      expect(result.order_id).toBe("ORDER-789");
      expect(result.step).toBe("froth_milk");
      expect(result.status).toBe("completed");
    });
  });
});
