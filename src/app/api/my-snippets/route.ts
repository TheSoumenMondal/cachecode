import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { codeSnippet, user } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ data: [] }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");
    const visibility = searchParams.get("visibility");

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

    const filters = [eq(codeSnippet.created_by, session.user.id)];

    if (tag) {
      const { arrayContains } = await import("drizzle-orm");
      filters.push(arrayContains(codeSnippet.tags, [tag]));
    }

    if (visibility === "public") {
      filters.push(eq(codeSnippet.isPublic, true));
    } else if (visibility === "private") {
      filters.push(eq(codeSnippet.isPublic, false));
    }

    const { and } = await import("drizzle-orm");
    const rawData = await baseQuery.where(and(...filters));

    const data = rawData.map(({ snippet, user }) => ({
      ...snippet,
      user,
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch my snippets via API:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "An unknown error occurred",
      { status: 500 },
    );
  }
}
