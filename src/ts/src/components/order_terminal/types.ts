/**
 * Order terminal types — derived from Zod schemas in src/schemas/order_terminal.schema.ts.
 * Single source of truth for request/response shapes.
 */
export type {
  BeverageType,
  OrderStatus,
  PlaceOrderRequest,
  OrderResponse,
  OrderRecord,
} from "../../schemas/order_terminal.schema.js";
