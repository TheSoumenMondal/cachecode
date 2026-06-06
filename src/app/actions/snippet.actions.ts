"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { codeSnippet } from "@/db/schema";
import { auth } from "@/lib/auth";

const createSnippetSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description is too long"),
  language: z.string().min(1, "Language is required"),
  code: z.string().min(1, "Code is required"),
  tags: z.string().optional(),
  isPublic: z.boolean().default(false),
});

export async function createSnippetAction(
  formData: z.infer<typeof createSnippetSchema>,
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return { error: "You must be logged in to create a snippet." };
    }

    const parsedData = createSnippetSchema.safeParse(formData);

    if (!parsedData.success) {
      return {
        error: "Invalid form data.",
        details: parsedData.error.flatten().fieldErrors,
      };
    }

    const { title, description, language, code, tags, isPublic } =
      parsedData.data;

    const tagsArray = tags
      ? tags
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter((t) => t.length > 0)
      : [];

    await db.insert(codeSnippet).values({
      title,
      description,
      language,
      code,
      tags: tagsArray,
      isPublic,
      created_by: session.user.id,
    });

    revalidatePath("/explore");
    revalidatePath("/my-snippets");
    revalidatePath("/");

    return { success: true, message: "Snippet created successfully!" };
  } catch (error) {
    console.error("Failed to create snippet:", error);
    return {
      error: "An unexpected error occurred while creating the snippet.",
    };
  }
}
