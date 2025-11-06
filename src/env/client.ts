import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const clientEnv = createEnv({
	clientPrefix: "VITE_",
	client: {
		VITE_COMPANY_NAME: z.string().min(1, "Company name is required"),
		VITE_TWITTER_CREATOR: z.string().min(1, "Twitter creator is required"),
		VITE_TWITTER_SITE: z.url("Must be a valid URL"),
		VITE_SITE_NAME: z.string().min(1, "Site name is required"),
		VITE_PARENT_ID: z.uuid("Parent Id missing"),
		VITE_WEBSITE_URL: z.string().optional(),
	},
	runtimeEnv: import.meta.env,
	emptyStringAsUndefined: true,
});
