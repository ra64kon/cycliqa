import { getDatabase } from "../../config/db.js";
import type { PlaceOrderRequest, OrderResponse, OrderRecord } from "./types.js";
import { BeverageTypeSchema } from "../../schemas/order_terminal.schema.js";
import type { BeverageType } from "./types.js";

const VALID_BEVERAGES = new Set(BeverageTypeSchema.options);

function validateBeverageType(value: string): BeverageType {
  if (!VALID_BEVERAGES.has(value as BeverageType)) {
    throw new Error(
      `Invalid beverage_type: '${value}'. Must be one of: ${[...VALID_BEVERAGES].join(", ")}`
    );
  }
  return value as BeverageType;
}

export async function placeOrder(request: PlaceOrderRequest): Promise<OrderResponse> {
  const beverageType = validateBeverageType(request.beverage_type);
  const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const db = await getDatabase();

  db.run(
    "INSERT INTO orders (order_id, beverage_type, with_milk_foam, customer_name, status) VALUES (?, ?, ?, ?, ?)",
    [orderId, beverageType, request.with_milk_foam ? 1 : 0, request.customer_name, "accepted"]
  );

  return {
    order_id: orderId,
    status: "accepted",
    beverage_type: beverageType,
    with_milk_foam: request.with_milk_foam,
    customer_name: request.customer_name,
  };
}

export async function getOrderStatus(orderId: string): Promise<OrderResponse> {
  const db = await getDatabase();
  const stmt = db.prepare("SELECT * FROM orders WHERE order_id = ?");
  stmt.bind([orderId]);

  if (!stmt.step()) {
    stmt.free();
    throw new Error(`Order not found: ${orderId}`);
  }

  const row = stmt.getAsObject() as unknown as OrderRecord;
  stmt.free();

  return {
    order_id: row.order_id,
    status: row.status,
    beverage_type: row.beverage_type,
    with_milk_foam: row.with_milk_foam === 1,
    customer_name: row.customer_name,
  };
}
