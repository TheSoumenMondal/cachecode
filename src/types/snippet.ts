import type { InferSelectModel } from "drizzle-orm";
import type { codeSnippet, user } from "@/db/schema";

export type CodeSnippetRow = InferSelectModel<typeof codeSnippet>;
export type UserRow = InferSelectModel<typeof user>;

export type PopulatedCodeSnippet = CodeSnippetRow & {
  user: {
    id: UserRow["id"];
    name: UserRow["name"];
    image: UserRow["image"];
  };
};
