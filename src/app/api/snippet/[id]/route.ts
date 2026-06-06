import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { codeSnippet } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    const existingSnippet = await db
      .select()
      .from(codeSnippet)
      .where(
        and(
          eq(codeSnippet.id, id),
          eq(codeSnippet.created_by, session.user.id),
        ),
      )
      .limit(1);

    if (existingSnippet.length === 0) {
      return new NextResponse("Snippet not found or unauthorized", {
        status: 404,
      });
    }

    await db.delete(codeSnippet).where(eq(codeSnippet.id, id));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete snippet:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "An unknown error occurred",
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, description, code, language, tags, isPublic } = body;

    if (!title || !description || !code || !language) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    let parsedTags: string[] = [];
    if (tags && typeof tags === "string") {
      parsedTags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    }

    const existingSnippet = await db
      .select()
      .from(codeSnippet)
      .where(
        and(
          eq(codeSnippet.id, id),
          eq(codeSnippet.created_by, session.user.id),
        ),
      )
      .limit(1);

    if (existingSnippet.length === 0) {
      return new NextResponse("Snippet not found or unauthorized", {
        status: 404,
      });
    }

    await db
      .update(codeSnippet)
      .set({
        title,
        description,
        code,
        language,
        tags: parsedTags,
        isPublic: !!isPublic,
      })
      .where(eq(codeSnippet.id, id));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to update snippet:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "An unknown error occurred",
      { status: 500 },
    );
  }
}
