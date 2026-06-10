import { z } from "zod";

/** Possible delivery attempt outcomes. */
export const DeliveryStatusSchema = z.enum(["delivered", "failed", "escalated"]);

/** Request to initiate delivery of an order to a destination. */
export const DeliverOrderRequestSchema = z.object({
  order_id: z.string().min(1, "order_id is required"),
  destination: z.string().min(1, "destination is required"),
});

/** Request to retry a previously failed delivery. */
export const RetryDeliveryRequestSchema = z.object({
  order_id: z.string().min(1, "order_id is required"),
});

/** Request to escalate a delivery that cannot be completed. */
export const EscalateDeliveryRequestSchema = z.object({
  order_id: z.string().min(1, "order_id is required"),
  failure_reason: z.string().min(1, "failure_reason is required"),
});

/** Response for an initial delivery attempt. */
export const DeliveryResponseSchema = z.object({
  order_id: z.string(),
  status: DeliveryStatusSchema,
  attempt_number: z.number().int(),
});

/** Response for a delivery retry. */
export const RetryDeliveryResponseSchema = z.object({
  order_id: z.string(),
  status: DeliveryStatusSchema,
  retry_count: z.number().int(),
});

/** Response for a delivery escalation. */
export const EscalateDeliveryResponseSchema = z.object({
  order_id: z.string(),
  status: DeliveryStatusSchema,
  failure_reason: z.string(),
});

export type DeliveryStatus = z.infer<typeof DeliveryStatusSchema>;
export type DeliverOrderRequest = z.infer<typeof DeliverOrderRequestSchema>;
export type RetryDeliveryRequest = z.infer<typeof RetryDeliveryRequestSchema>;
export type EscalateDeliveryRequest = z.infer<typeof EscalateDeliveryRequestSchema>;
export type DeliveryResponse = z.infer<typeof DeliveryResponseSchema>;
export type RetryDeliveryResponse = z.infer<typeof RetryDeliveryResponseSchema>;
export type EscalateDeliveryResponse = z.infer<typeof EscalateDeliveryResponseSchema>;
