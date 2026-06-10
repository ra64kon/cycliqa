import { sign } from "hono/jwt";
import { ENV } from "./env.js";

export const AUTH_CONFIG = {
  JWT_SECRET: ENV.JWT_SECRET,
  /** Session token TTL in seconds (1 hour). */
  SESSION_TTL_SECONDS: 3600,
} as const;

/**
 * Mints a service-level JWT for internal component-to-component calls in multi-mode.
 * Uses the same shared secret so downstream services can validate it.
 */
export async function mintServiceToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return sign(
    { sub: "service", iat: now, exp: now + AUTH_CONFIG.SESSION_TTL_SECONDS },
    AUTH_CONFIG.JWT_SECRET,
    "HS256"
  );
}
