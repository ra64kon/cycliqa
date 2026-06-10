import { z } from "zod";

/** Request schema for all brewing step endpoints (grind, prepare, froth). */
export const OrderStepRequestSchema = z.object({
  order_id: z.string().min(1, "order_id is required"),
});

/** Enum of valid brewing step names. */
export const BrewingStepSchema = z.enum(["grind_beans", "prepare_coffee", "froth_milk"]);

/** Response schema for all brewing step endpoints. */
export const BrewingStepResponseSchema = z.object({
  order_id: z.string(),
  step: BrewingStepSchema,
  status: z.literal("completed"),
});

export const ErrorResponseSchema = z.object({
  error: z.string(),
});

export type OrderStepRequest = z.infer<typeof OrderStepRequestSchema>;
export type BrewingStep = z.infer<typeof BrewingStepSchema>;
export type BrewingStepResponse = z.infer<typeof BrewingStepResponseSchema>;
