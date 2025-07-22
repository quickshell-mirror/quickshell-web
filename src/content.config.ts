import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const guide = defineCollection({
	loader: glob({ pattern: "**/*", base: "src/guide" }),
	schema: z.object({
		title: z.string(),
    index: z.number(),
	}),
});

export const collections = { guide };
