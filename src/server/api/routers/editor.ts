import { env } from "@/env";
import OpenAI from "openai";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const client = new OpenAI({
    apiKey: env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});




export const editorRouter = createTRPCRouter({

    rewriteParagraph: protectedProcedure
    .input(z.object({
        paragraph: z.string().min(1),
    }))
    .mutation(async ({input}) => {
        const response = await client.responses.create({
            model: "openai/gpt-oss-20b",
            input: `Rewrite the following paragraph in a more engaging and informative way, dont give any options or any extra explanation or instructions, it should contain just the replacement of ${input.paragraph}`,
        });
        return response.output_text
    })
})