import { jwt } from "hono/jwt";
import { AUTH_CONFIG } from "../config/auth.js";

/**
 * JWT Bearer authentication middleware.
 * Validates the Authorization header as a Bearer JWT using the configured secret.
 * Returns 401 for missing/invalid tokens, 403 for insufficient permissions.
 */
export const bearerAuth = jwt({ secret: AUTH_CONFIG.JWT_SECRET, alg: "HS256" });
