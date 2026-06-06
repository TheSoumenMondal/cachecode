"use client";

import {
  CheckCircleIcon,
  CopyIcon,
  DotsThreeVerticalIcon,
  PencilSimpleIcon,
  TrashIcon,
  UserCircleCheckIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SUPPORTED_LANGUAGES } from "@/constant/language";
import type { PopulatedCodeSnippet } from "@/types/snippet";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { type FormState, SnippetFormDialog } from "./snippet-form-dialog";

type Language = (typeof SUPPORTED_LANGUAGES)[number];

interface SnippetCardProps {
  snippet: PopulatedCodeSnippet;
  isEditable?: boolean;
  onDeleted?: (id: string) => void;
  onUpdated?: () => void;
}

const SnippetCard = ({
  snippet,
  isEditable,
  onDeleted,
  onUpdated,
}: SnippetCardProps) => {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    toast.success("Code copied to clipboard!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/snippet/${snippet.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete snippet");
      }

      toast.success("Snippet deleted successfully!");
      if (onDeleted) onDeleted(snippet.id);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete snippet.");
    } finally {
      setIsDeleting(false);
    }
  };

  const initialData: FormState = {
    title: snippet.title,
    description: snippet.description,
    code: snippet.code,
    language: snippet.language as Language,
    isPublic: snippet.isPublic,
    tags: snippet.tags ? snippet.tags.join(", ") : "",
  };

  return (
    <>
      <Card
        className={`flex h-full w-full gap-0 py-0 relative ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
      >
        <CardHeader
          className="flex flex-row items-start justify-between py-4"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, color-mix(in srgb, var(--foreground) 2.5%, transparent) 0, color-mix(in srgb, var(--foreground) 2.5%, transparent) 1px, transparent 1px, transparent 5px), repeating-linear-gradient(-45deg, color-mix(in srgb, var(--foreground) 2.5%, transparent) 0, color-mix(in srgb, var(--foreground) 2.5%, transparent) 1px, transparent 1px, transparent 5px)",
          }}
        >
          <div className="w-full pr-8">
            {snippet.description && (
              <CardTitle className="text-sm font-semibold">
                <span className="sm:hidden">
                  {snippet.description.split(" ").slice(0, 8).join(" ")}
                  {snippet.description.split(" ").length > 8 ? "..." : ""}
                </span>
                <span className="hidden sm:inline line-clamp-2">
                  {snippet.description}
                </span>
              </CardTitle>
            )}
          </div>
          {isEditable && (
            <div className="absolute top-3 right-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="p-1 rounded-md hover:bg-background/80 transition-colors cursor-pointer outline-none ring-0"
                  >
                    <DotsThreeVerticalIcon
                      weight="bold"
                      className="size-4 text-foreground"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36 rounded-none">
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center gap-2 text-xs rounded-none"
                    onSelect={() => setEditOpen(true)}
                  >
                    <PencilSimpleIcon weight="duotone" className="size-3.5" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center gap-2 text-xs text-destructive focus:bg-destructive/10 focus:text-destructive rounded-none"
                    onSelect={() => setDeleteAlertOpen(true)}
                  >
                    <TrashIcon weight="duotone" className="size-3.5" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
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
          <div className="flex gap-1.5 flex-wrap justify-start sm:justify-end">
            {snippet.tags?.map((tag, index) => (
              <Badge
                key={tag}
                variant="outline"
                className={`text-[10px] text-muted-foreground border-border/50 ${
                  index >= 2 ? "hidden sm:inline-flex" : ""
                }`}
              >
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-1.5 flex-row text-xs shrink-0">
            <Avatar className="size-5">
              <AvatarImage
                src={snippet.user?.image || undefined}
                alt={snippet.user?.name || "User"}
              />
              <AvatarFallback>
                <UserCircleCheckIcon weight="duotone" />
              </AvatarFallback>
            </Avatar>
            {snippet.user?.name && (
              <>
                <span className="sm:hidden">
                  {snippet.user.name.split(" ")[0]}
                </span>
                <span className="hidden sm:inline">{snippet.user.name}</span>
              </>
            )}
          </div>
        </CardFooter>
      </Card>

      {isEditable && (
        <SnippetFormDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          mode="edit"
          snippetId={snippet.id}
          initialData={initialData}
          onSuccess={onUpdated}
        />
      )}

      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent className="rounded-none sm:rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              snippet "{snippet.title}" from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-none cursor-pointer border border-destructive"
              variant={"destructive"}
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SnippetCard;
