import { sign } from "hono/jwt";
import { ENV } from "../../config/env.js";
import { AUTH_CONFIG } from "../../config/auth.js";
import type { SessionTokenResponse, SubmitOrderRequest, SubmitOrderResponse } from "./types.js";
import type { OrderResponse } from "../order_terminal/types.js";
import type { ProcessStatusResponse } from "../process_control/types.js";

// Single-mode: direct service imports
import { placeOrder, getOrderStatus } from "../order_terminal/service.js";
import { startOrderProcess, getProcessStatus as getProcessStatusFn } from "../process_control/service.js";

/**
 * Creates a short-lived JWT session for use by the web frontend.
 * The session endpoint is publicly available (no prior auth required).
 */
export async function createSession(): Promise<SessionTokenResponse> {
  const now = Math.floor(Date.now() / 1000);
  const access_token = await sign(
    { sub: "web-session", iat: now, exp: now + AUTH_CONFIG.SESSION_TTL_SECONDS },
    AUTH_CONFIG.JWT_SECRET,
    "HS256"
  );
  return {
    access_token,
    token_type: "Bearer",
    expires_in: AUTH_CONFIG.SESSION_TTL_SECONDS,
  };
}

/**
 * Submits a new order and starts the brewing process.
 * - Single-mode: calls order_terminal and process_control service functions directly.
 * - Multi-mode: calls their HTTP APIs using the caller's auth token.
 */
export async function submitOrder(
  request: SubmitOrderRequest,
  authToken: string
): Promise<SubmitOrderResponse> {
  if (ENV.DEPLOY_MODE === "multi") {
    const orderRes = await fetch(`${ENV.SERVICES.ORDER_TERMINAL_URL}/api/v1/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: authToken },
      body: JSON.stringify(request),
    });
    if (!orderRes.ok) {
      const err = (await orderRes.json()) as { error?: string };
      throw new Error(err.error ?? `Order terminal responded with ${orderRes.status}`);
    }
    const order = (await orderRes.json()) as OrderResponse;
    const processId = `PROC-${order.order_id.replace("ORDER-", "")}`;

    // Trigger process asynchronously — fire-and-forget
    fetch(`${ENV.SERVICES.PROCESS_CONTROL_URL}/api/v1/process-control/processes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: authToken },
      body: JSON.stringify({
        order_id: order.order_id,
        beverage_type: order.beverage_type,
        with_milk_foam: order.with_milk_foam,
        process_id: processId,
      }),
    }).catch(() => console.error(`Failed to trigger process for order ${order.order_id}`));

    return {
      order_id: order.order_id,
      process_id: processId,
      status: order.status,
      beverage_type: order.beverage_type,
      with_milk_foam: order.with_milk_foam,
      customer_name: order.customer_name,
    };
  }

  // Single-mode: direct function calls
  const order = await placeOrder(request);
  const processId = `PROC-${order.order_id.replace("ORDER-", "")}`;

  startOrderProcess(
    {
      order_id: order.order_id,
      beverage_type: order.beverage_type,
      with_milk_foam: order.with_milk_foam,
      process_id: processId,
    },
    authToken
  ).catch(() => console.error(`Failed to trigger process for order ${order.order_id}`));

  return {
    order_id: order.order_id,
    process_id: processId,
    status: order.status,
    beverage_type: order.beverage_type,
    with_milk_foam: order.with_milk_foam,
    customer_name: order.customer_name,
  };
}

/** Returns the current status of an order via the appropriate backend path. */
export async function getWebOrderStatus(
  orderId: string,
  authToken: string
): Promise<OrderResponse> {
  if (ENV.DEPLOY_MODE === "multi") {
    const r = await fetch(
      `${ENV.SERVICES.ORDER_TERMINAL_URL}/api/v1/orders?order_id=${encodeURIComponent(orderId)}`,
      { headers: { Authorization: authToken } }
    );
    if (!r.ok) {
      const err = (await r.json()) as { error?: string };
      throw new Error(err.error ?? `Order terminal responded with ${r.status}`);
    }
    return r.json() as Promise<OrderResponse>;
  }
  return getOrderStatus(orderId);
}

/** Returns the live process status via the appropriate backend path. */
export async function getWebProcessStatus(
  processId: string,
  authToken: string
): Promise<ProcessStatusResponse> {
  if (ENV.DEPLOY_MODE === "multi") {
    const r = await fetch(
      `${ENV.SERVICES.PROCESS_CONTROL_URL}/api/v1/process-control/processes/${encodeURIComponent(processId)}`,
      { headers: { Authorization: authToken } }
    );
    if (!r.ok) {
      const err = (await r.json()) as { error?: string };
      throw new Error(err.error ?? `Process control responded with ${r.status}`);
    }
    return r.json() as Promise<ProcessStatusResponse>;
  }
  return getProcessStatusFn(processId);
}
