import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { codeSnippet, user } from "@/db/schema";

export async function GET() {
  try {
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
      .where(eq(codeSnippet.isPublic, true))
      .orderBy(desc(codeSnippet.createdAt));

    const data = rawData.map(({ snippet, user }) => ({
      ...snippet,
      user,
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return new NextResponse(
      error instanceof Error ? error.message : "An unknown error occurred",
      { status: 500 },
    );
  }
}
