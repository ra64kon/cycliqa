/**
 * Web channel types — derived from Zod schemas in src/schemas/web_channel.schema.ts.
 * The web channel is the public-facing facade; all other components are internal.
 */
export type {
  SessionTokenResponse,
  SubmitOrderRequest,
  SubmitOrderResponse,
  WebChannelOrderResponse,
  WebChannelProcessStatusResponse,
} from "../../schemas/web_channel.schema.js";
