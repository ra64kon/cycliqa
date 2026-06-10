import { getDatabase } from "../../config/db.js";
import { executeProcess } from "./orchestrator.js";
import type {
  StartOrderProcessRequest,
  StartOrderProcessResponse,
  ProcessStatusResponse,
  ProcessInstanceRecord,
} from "./types.js";

export async function startOrderProcess(
  request: StartOrderProcessRequest,
  /** Bearer token forwarded from the caller — used for downstream HTTP calls in multi-mode. */
  authToken: string = ""
): Promise<StartOrderProcessResponse> {
  const processId = request.process_id ?? `PROC-${Date.now()}`;
  const db = await getDatabase();

  db.run(
    "INSERT INTO process_instances (process_id, order_id, process_status) VALUES (?, ?, ?)",
    [processId, request.order_id, "running"]
  );

  void executeProcess({
    processId,
    orderId: request.order_id,
    beverageType: request.beverage_type,
    withMilkFoam: request.with_milk_foam,
    destination: "internal",
    authToken,
  });

  return {
    process_id: processId,
    order_id: request.order_id,
    process_status: "running",
  };
}

export async function getProcessStatus(processId: string): Promise<ProcessStatusResponse> {
  const db = await getDatabase();
  const stmt = db.prepare("SELECT * FROM process_instances WHERE process_id = ?");
  stmt.bind([processId]);

  if (!stmt.step()) {
    stmt.free();
    throw new Error(`Process not found: ${processId}`);
  }

  const row = stmt.getAsObject() as unknown as ProcessInstanceRecord;
  stmt.free();

  return {
    process_id: row.process_id,
    order_id: row.order_id,
    process_status: row.process_status,
    last_completed_step: row.last_completed_step,
  };
}
