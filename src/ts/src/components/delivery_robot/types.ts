/**
 * Delivery robot types — derived from Zod schemas in src/schemas/delivery_robot.schema.ts.
 * Single source of truth for request/response shapes.
 */
export type {
  DeliveryStatus,
  DeliverOrderRequest,
  RetryDeliveryRequest,
  EscalateDeliveryRequest,
  DeliveryResponse,
  RetryDeliveryResponse,
  EscalateDeliveryResponse,
} from "../../schemas/delivery_robot.schema.js";
