"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { codeSnippet, user } from "@/db/schema";
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

export async function getPublicSnippets(tagFilter?: string) {
  try {
    const baseQuery = db
      .select({
        snippet: codeSnippet,
        user: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })
      .from(codeSnippet)
      .innerJoin(user, eq(codeSnippet.created_by, user.id))
      .orderBy(desc(codeSnippet.createdAt))
      .$dynamic();

    const filters = [eq(codeSnippet.isPublic, true)];

    if (tagFilter) {
      // For PostgreSQL arrays, arrayContains checks if the array contains the given elements
      // Drizzle provides arrayContains: arrayContains(column, [value])
      const { arrayContains } = await import("drizzle-orm");
      filters.push(arrayContains(codeSnippet.tags, [tagFilter]));
    }

    const { and } = await import("drizzle-orm");
    const rawData = await baseQuery.where(and(...filters));

    return rawData.map(({ snippet, user }) => ({
      ...snippet,
      user,
    }));
  } catch (error) {
    console.error("Failed to fetch public snippets:", error);
    return [];
  }
}

export async function getAllTags() {
  try {
    const rawData = await db
      .select({ tags: codeSnippet.tags })
      .from(codeSnippet)
      .where(eq(codeSnippet.isPublic, true));

    const tagSet = new Set<string>();
    rawData.forEach((row) => {
      row.tags.forEach((tag) => {
        tagSet.add(tag);
      });
    });
    return Array.from(tagSet).sort();
  } catch (error) {
    console.error("Failed to fetch all tags:", error);
    return [];
  }
}

export async function getUserTags(userId: string) {
  try {
    const rawData = await db
      .select({ tags: codeSnippet.tags })
      .from(codeSnippet)
      .where(eq(codeSnippet.created_by, userId));

    const tagSet = new Set<string>();
    rawData.forEach((row) => {
      row.tags.forEach((tag) => {
        tagSet.add(tag);
      });
    });
    return Array.from(tagSet).sort();
  } catch (error) {
    console.error("Failed to fetch user tags:", error);
    return [];
  }
}
