import { z } from "zod";

/** Possible states of an order process instance. */
export const ProcessStatusSchema = z.enum(["running", "completed", "escalated"]);

/** Supported beverage types (mirrored from order_terminal for local validation). */
export const ProcessBeverageTypeSchema = z.enum(["Espresso", "Cappuccino", "Latte Macchiato"]);

/** Request to start a new order process. */
export const StartOrderProcessRequestSchema = z.object({
  order_id: z.string().min(1, "order_id is required"),
  beverage_type: ProcessBeverageTypeSchema,
  with_milk_foam: z.boolean(),
  /** Optional externally assigned process ID (e.g. PROC-{timestamp}). */
  process_id: z.string().optional(),
});

/** Response after successfully creating a process instance. */
export const StartOrderProcessResponseSchema = z.object({
  process_id: z.string(),
  order_id: z.string(),
  process_status: ProcessStatusSchema,
});

/** Live status snapshot of a running or completed process. */
export const ProcessStatusResponseSchema = z.object({
  process_id: z.string(),
  order_id: z.string(),
  process_status: ProcessStatusSchema,
  last_completed_step: z.string().nullable(),
});

/** Internal DB row shape for the process_instances table. */
export const ProcessInstanceRecordSchema = z.object({
  process_id: z.string(),
  order_id: z.string(),
  process_status: ProcessStatusSchema,
  last_completed_step: z.string().nullable(),
  started_at: z.string(),
  completed_at: z.string().nullable(),
});

export type ProcessStatus = z.infer<typeof ProcessStatusSchema>;
export type StartOrderProcessRequest = z.infer<typeof StartOrderProcessRequestSchema>;
export type StartOrderProcessResponse = z.infer<typeof StartOrderProcessResponseSchema>;
export type ProcessStatusResponse = z.infer<typeof ProcessStatusResponseSchema>;
export type ProcessInstanceRecord = z.infer<typeof ProcessInstanceRecordSchema>;
