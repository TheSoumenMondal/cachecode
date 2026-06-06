"use client";

import {
  CheckCircleIcon,
  CopyIcon,
  UserCircleCheckIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PopulatedCodeSnippet } from "@/types/snippet";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const SnippetCard = ({ snippet }: { snippet: PopulatedCodeSnippet }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    toast.success("Code copied to clipboard!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="flex h-full w-full gap-0 py-0">
      <CardHeader
        className="flex py-4"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, color-mix(in srgb, var(--foreground) 2.5%, transparent) 0, color-mix(in srgb, var(--foreground) 2.5%, transparent) 1px, transparent 1px, transparent 5px), repeating-linear-gradient(-45deg, color-mix(in srgb, var(--foreground) 2.5%, transparent) 0, color-mix(in srgb, var(--foreground) 2.5%, transparent) 1px, transparent 1px, transparent 5px)",
        }}
      >
        <div className="w-full">
          {snippet.description && (
            <CardTitle className="text-sm font-semibold line-clamp-2">
              {snippet.description}
            </CardTitle>
          )}
        </div>
      </CardHeader>

      <CardContent className="py-4 border-t p-0">
        <div className="w-full flex justify-between items-center py-2 px-4">
          <div className="flex gap-2 items-center text-xs font-semibold">
            {snippet.title}
          </div>
          <div className="flex gap-2 items-center">
            <Badge
              variant="secondary"
              className="font-mono text-[10px] uppercase tracking-wider"
            >
              {snippet.language}
            </Badge>
            <button
              type="button"
              onClick={handleCopy}
              className="cursor-pointer"
            >
              {copied ? (
                <CheckCircleIcon
                  className="text-emerald-500 size-4"
                  weight="duotone"
                />
              ) : (
                <CopyIcon weight="duotone" className="size-4" />
              )}
            </button>
          </div>
        </div>
        <div className="group rounded-none overflow-hidden border-t">
          <SyntaxHighlighter
            language={snippet.language}
            style={oneDark}
            customStyle={{
              margin: 0,
              background: "transparent",
              fontSize: "13px",
              fontFamily: "var(--font-fira-code), monospace",
              textShadow: "none",
            }}
            codeTagProps={{
              style: {
                textShadow: "none",
              },
            }}
          >
            {snippet.code}
          </SyntaxHighlighter>
        </div>
      </CardContent>

      <CardFooter className="border-t flex items-center justify-between py-2">
        <div className="flex gap-1.5 flex-wrap justify-end">
          {snippet.tags?.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-[10px] text-muted-foreground border-border/50"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-1.5 flex-row">
          <Avatar className="size-5">
            <AvatarImage
              src={snippet.user.image || undefined}
              alt={snippet.user.name}
            />
            <AvatarFallback>
              <UserCircleCheckIcon weight="duotone" />
            </AvatarFallback>
          </Avatar>
          {snippet.user.name}
        </div>
      </CardFooter>
    </Card>
  );
};

export default SnippetCard;
