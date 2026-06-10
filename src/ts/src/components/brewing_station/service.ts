import type { GrindBeansResponse, PrepareCoffeeResponse, FrothMilkResponse } from "./types.js";

export function grindBeans(orderId: string): GrindBeansResponse {
  return {
    order_id: orderId,
    step: "grind_beans",
    status: "completed",
  };
}

export function prepareCoffee(orderId: string): PrepareCoffeeResponse {
  return {
    order_id: orderId,
    step: "prepare_coffee",
    status: "completed",
  };
}

export function frothMilk(orderId: string): FrothMilkResponse {
  return {
    order_id: orderId,
    step: "froth_milk",
    status: "completed",
  };
}
