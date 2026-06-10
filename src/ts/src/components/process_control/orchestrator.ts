import { ENV } from "../../config/env.js";
import { mintServiceToken } from "../../config/auth.js";
import { getDatabase } from "../../config/db.js";
import type { ProcessStatus } from "./types.js";

// Single-mode: direct service imports (tree-shaken away in multi-mode runtime path)
import { grindBeans, prepareCoffee, frothMilk } from "../brewing_station/service.js";
import {
  deliverOrder as deliverOrderFn,
  retryDelivery as retryDeliveryFn,
  escalateDelivery as escalateDeliveryFn,
} from "../delivery_robot/service.js";

const MAX_DELIVERY_RETRIES = 3;
const STEP_DELAY_MS = 2000;

interface ProcessContext {
  processId: string;
  orderId: string;
  beverageType: string;
  withMilkFoam: boolean;
  destination: string;
  /** Bearer token passed through from the caller for multi-mode HTTP calls. */
  authToken?: string;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Multi-mode HTTP helpers ──────────────────────────────────────────────────

async function resolveAuthHeader(ctx: ProcessContext): Promise<string> {
  if (ctx.authToken) return ctx.authToken;
  return `Bearer ${await mintServiceToken()}`;
}

async function httpPost(url: string, body: unknown, authHeader: string): Promise<{ status?: string }> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: authHeader },
    body: JSON.stringify(body),
  });
  return res.json() as Promise<{ status?: string }>;
}

// ─── Main process execution ───────────────────────────────────────────────────

export async function executeProcess(ctx: ProcessContext): Promise<void> {
  await updateProcessStatus(ctx.processId, "running");
  const isMulti = ENV.DEPLOY_MODE === "multi";

  try {
    const authHeader = isMulti ? await resolveAuthHeader(ctx) : "";

    // Step 1: Grind beans
    await delay(STEP_DELAY_MS);
    if (isMulti) {
      await httpPost(`${ENV.SERVICES.BREWING_STATION_URL}/api/v1/brewing/grind`, { order_id: ctx.orderId }, authHeader);
    } else {
      grindBeans(ctx.orderId);
    }
    await updateStepStatus(ctx.processId, "grind_beans", "completed");
    await updateLastCompletedStep(ctx.processId, "grind_beans");

    // Step 2: Prepare coffee
    await delay(STEP_DELAY_MS);
    if (isMulti) {
      await httpPost(`${ENV.SERVICES.BREWING_STATION_URL}/api/v1/brewing/prepare`, { order_id: ctx.orderId }, authHeader);
    } else {
      prepareCoffee(ctx.orderId);
    }
    await updateStepStatus(ctx.processId, "prepare_coffee", "completed");
    await updateLastCompletedStep(ctx.processId, "prepare_coffee");

    // Step 3: Froth milk (optional)
    if (ctx.withMilkFoam) {
      await delay(STEP_DELAY_MS);
      if (isMulti) {
        await httpPost(`${ENV.SERVICES.BREWING_STATION_URL}/api/v1/brewing/froth-milk`, { order_id: ctx.orderId }, authHeader);
      } else {
        frothMilk(ctx.orderId);
      }
      await updateStepStatus(ctx.processId, "froth_milk", "completed");
      await updateLastCompletedStep(ctx.processId, "froth_milk");
    }

    // Step 4: Deliver order (with retries)
    let delivered = false;
    for (let attempt = 1; attempt <= MAX_DELIVERY_RETRIES + 1; attempt++) {
      await delay(STEP_DELAY_MS);
      await updateStepStatus(ctx.processId, `deliver_order_attempt_${attempt}`, "attempted");

      let deliveryStatus: string;
      if (isMulti) {
        const result = await httpPost(
          `${ENV.SERVICES.DELIVERY_ROBOT_URL}/api/v1/delivery`,
          { order_id: ctx.orderId, destination: ctx.destination },
          authHeader
        );
        deliveryStatus = result.status ?? "failed";
      } else {
        const result = await deliverOrderFn({ order_id: ctx.orderId, destination: ctx.destination });
        deliveryStatus = result.status;
      }

      if (deliveryStatus === "delivered") {
        await updateStepStatus(ctx.processId, "deliver_order", "completed");
        await updateLastCompletedStep(ctx.processId, "deliver_order");
        delivered = true;
        break;
      }

      if (attempt <= MAX_DELIVERY_RETRIES) {
        await updateStepStatus(ctx.processId, `retry_delivery_${attempt}`, "attempted");
        if (isMulti) {
          await httpPost(`${ENV.SERVICES.DELIVERY_ROBOT_URL}/api/v1/delivery/retry`, { order_id: ctx.orderId }, authHeader);
        } else {
          await retryDeliveryFn(ctx.orderId);
        }
      } else {
        const failureReason = `Delivery failed after ${MAX_DELIVERY_RETRIES} retries`;
        if (isMulti) {
          await httpPost(
            `${ENV.SERVICES.DELIVERY_ROBOT_URL}/api/v1/delivery/escalate`,
            { order_id: ctx.orderId, failure_reason: failureReason },
            authHeader
          );
        } else {
          await escalateDeliveryFn(ctx.orderId, failureReason);
        }
        await updateProcessStatus(ctx.processId, "escalated");
        await updateLastCompletedStep(ctx.processId, "escalate_delivery");
        return;
      }
    }

    if (delivered) {
      await updateProcessStatus(ctx.processId, "completed");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await updateProcessStatus(ctx.processId, "escalated");
    await updateStepStatus(ctx.processId, "error", "failed");
    console.error(`Process ${ctx.processId} failed: ${message}`);
  }
}

// ─── DB helpers ───────────────────────────────────────────────────────────────

async function updateProcessStatus(processId: string, status: ProcessStatus): Promise<void> {
  const db = await getDatabase();
  const completedAt = status === "completed" || status === "escalated" ? new Date().toISOString() : null;
  db.run(
    "UPDATE process_instances SET process_status = ?, completed_at = ? WHERE process_id = ?",
    [status, completedAt, processId]
  );
}

async function updateLastCompletedStep(processId: string, step: string): Promise<void> {
  const db = await getDatabase();
  db.run(
    "UPDATE process_instances SET last_completed_step = ? WHERE process_id = ?",
    [step, processId]
  );
}

async function updateStepStatus(processId: string, stepName: string, stepStatus: string): Promise<void> {
  const db = await getDatabase();
  db.run(
    "INSERT INTO process_steps (process_id, step_name, step_status) VALUES (?, ?, ?)",
    [processId, stepName, stepStatus]
  );
}
