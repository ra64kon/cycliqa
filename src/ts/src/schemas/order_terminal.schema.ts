import { z } from "zod";

/** Supported beverage types. */
export const BeverageTypeSchema = z.enum(["Espresso", "Cappuccino", "Latte Macchiato"]);

/** Possible order lifecycle states. */
export const OrderStatusSchema = z.enum(["accepted", "delivered", "delivery_escalated"]);

/** Request payload to place a new order. */
export const PlaceOrderRequestSchema = z.object({
  beverage_type: BeverageTypeSchema,
  with_milk_foam: z.boolean(),
  customer_name: z.string().min(1, "customer_name is required"),
});

/** Response payload for an order (read or create). */
export const OrderResponseSchema = z.object({
  order_id: z.string(),
  status: OrderStatusSchema,
  beverage_type: BeverageTypeSchema,
  with_milk_foam: z.boolean(),
  customer_name: z.string(),
});

/** Internal DB row shape for the orders table. */
export const OrderRecordSchema = z.object({
  order_id: z.string(),
  beverage_type: BeverageTypeSchema,
  with_milk_foam: z.number().int(), // stored as 0 or 1 in SQLite
  customer_name: z.string(),
  status: OrderStatusSchema,
  created_at: z.string(),
  updated_at: z.string(),
});

export type BeverageType = z.infer<typeof BeverageTypeSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type PlaceOrderRequest = z.infer<typeof PlaceOrderRequestSchema>;
export type OrderResponse = z.infer<typeof OrderResponseSchema>;
export type OrderRecord = z.infer<typeof OrderRecordSchema>;
