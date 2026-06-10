/** Central environment configuration. All env vars are read once at startup. */
export const ENV = {
  PORT: parseInt(process.env.PORT || "3000"),
  DEPLOY_MODE: (process.env.DEPLOY_MODE || "single") as "single" | "multi",
  JWT_SECRET: process.env.COFFEE_TO_GO_JWT_SECRET || "dev-jwt-secret-change-me",
  SERVICES: {
    ORDER_TERMINAL_URL: process.env.SERVICE_ORDER_TERMINAL_URL || "http://localhost:3002",
    BREWING_STATION_URL: process.env.SERVICE_BREWING_STATION_URL || "http://localhost:3003",
    DELIVERY_ROBOT_URL: process.env.SERVICE_DELIVERY_ROBOT_URL || "http://localhost:3004",
    PROCESS_CONTROL_URL: process.env.SERVICE_PROCESS_CONTROL_URL || "http://localhost:3005",
  },
} as const;
