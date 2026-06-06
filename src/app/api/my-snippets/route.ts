import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { codeSnippet, user } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ data: [] }, { status: 401 });
    }

    const rawData = await db
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
      .where(eq(codeSnippet.created_by, session.user.id))
      .orderBy(desc(codeSnippet.createdAt));

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
