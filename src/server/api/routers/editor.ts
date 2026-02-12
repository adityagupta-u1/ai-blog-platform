import { env } from "@/env";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const ai = new GoogleGenAI({apiKey: env.GOOGLE_GEMINI_API_KEY})

export const editorRouter = createTRPCRouter({

    rewriteParagraph: protectedProcedure
    .input(z.object({
        paragraph: z.string().min(1),
    }))
    .mutation(async ({input}) => {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `Rewrite the following paragraph in a more engaging and informative way, dont give any options or any extra explanation or instructions, it should contain just the replacement of ${input.paragraph}`,
        });
        return response.text;
    })
})