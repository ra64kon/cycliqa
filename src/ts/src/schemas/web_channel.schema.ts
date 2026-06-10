import { z } from "zod";
import { BeverageTypeSchema, OrderStatusSchema } from "./order_terminal.schema.js";
import { ProcessStatusSchema } from "./process_control.schema.js";

/** Response containing the session JWT issued by the web channel. */
export const SessionTokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.literal("Bearer"),
  expires_in: z.number().int(),
});

/** Request to submit a new order via the web channel facade. */
export const SubmitOrderRequestSchema = z.object({
  beverage_type: BeverageTypeSchema,
  with_milk_foam: z.boolean(),
  customer_name: z.string().min(1, "customer_name is required"),
});

/**
 * Response after submitting an order via the web channel.
 * Includes both the order ID and the initiated process ID.
 */
export const SubmitOrderResponseSchema = z.object({
  order_id: z.string(),
  process_id: z.string(),
  status: OrderStatusSchema,
  beverage_type: BeverageTypeSchema,
  with_milk_foam: z.boolean(),
  customer_name: z.string(),
});

/** Order status response as exposed through the web channel. */
export const WebChannelOrderResponseSchema = z.object({
  order_id: z.string(),
  status: OrderStatusSchema,
  beverage_type: BeverageTypeSchema,
  with_milk_foam: z.boolean(),
  customer_name: z.string(),
});

/** Process status response as exposed through the web channel. */
export const WebChannelProcessStatusResponseSchema = z.object({
  process_id: z.string(),
  order_id: z.string(),
  process_status: ProcessStatusSchema,
  last_completed_step: z.string().nullable(),
});

export type SessionTokenResponse = z.infer<typeof SessionTokenResponseSchema>;
export type SubmitOrderRequest = z.infer<typeof SubmitOrderRequestSchema>;
export type SubmitOrderResponse = z.infer<typeof SubmitOrderResponseSchema>;
export type WebChannelOrderResponse = z.infer<typeof WebChannelOrderResponseSchema>;
export type WebChannelProcessStatusResponse = z.infer<typeof WebChannelProcessStatusResponseSchema>;
