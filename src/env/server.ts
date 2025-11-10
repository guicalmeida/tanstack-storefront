import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const serverEnv = createEnv({
  server: {
    VENDURE_SHOP_API_ENDPOINT: z.url("Must be a valid URL"),
    SESSION_SECRET: z
      .string()
      .min(32, "Session secret must be at least 32 characters"),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

// Helper functions to check environment
export const isDevelopment = serverEnv.NODE_ENV === "development";
export const isProduction = serverEnv.NODE_ENV === "production";
export const isTest = serverEnv.NODE_ENV === "test";
