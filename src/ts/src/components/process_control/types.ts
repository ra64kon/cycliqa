/**
 * Process control types — derived from Zod schemas in src/schemas/process_control.schema.ts.
 * Single source of truth for request/response shapes.
 */
export type {
  ProcessStatus,
  StartOrderProcessRequest,
  StartOrderProcessResponse,
  ProcessStatusResponse,
  ProcessInstanceRecord,
} from "../../schemas/process_control.schema.js";
