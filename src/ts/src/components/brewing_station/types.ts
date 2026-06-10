/**
 * Brewing station types — derived from Zod schemas in src/schemas/brewing_station.schema.ts.
 * Single source of truth for request/response shapes.
 */
import type { OrderStepRequest, BrewingStepResponse } from "../../schemas/brewing_station.schema.js";

export type GrindBeansRequest = OrderStepRequest;
export type GrindBeansResponse = BrewingStepResponse;
export type PrepareCoffeeRequest = OrderStepRequest;
export type PrepareCoffeeResponse = BrewingStepResponse;
export type FrothMilkRequest = OrderStepRequest;
export type FrothMilkResponse = BrewingStepResponse;
