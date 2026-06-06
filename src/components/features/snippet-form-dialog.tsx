"use client";

import {
  CaretUpDownIcon,
  EyeIcon,
  PencilIcon,
  PencilSimpleIcon,
  TagIcon,
} from "@phosphor-icons/react";
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Field, FieldError, FieldGroup } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { Switch } from "../ui/switch";

const cleanOneDark = Object.fromEntries(
  Object.entries(oneDark).map(([key, value]) => [
    key,
    { ...(value as React.CSSProperties), textShadow: "none" },
  ]),
);

import { createSnippetAction } from "@/app/actions/snippet.actions";
import { SUPPORTED_LANGUAGES } from "@/constant/language";
import { cn } from "@/lib/utils";

type Language = (typeof SUPPORTED_LANGUAGES)[number];

function langLabel(lang: string) {
  return lang
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export interface FormState {
  title: string;
  description: string;
  language: Language;
  code: string;
  isPublic: boolean;
  tags: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  language?: string;
  code?: string;
  tags?: string;
}

const defaultInitialState: FormState = {
  title: "",
  description: "",
  language: "typescript",
  code: "",
  isPublic: true,
  tags: "",
};

export interface SnippetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initialData?: FormState;
  snippetId?: string;
  onSuccess?: () => void;
}

export const SnippetFormDialog = ({
  open,
  onOpenChange,
  mode,
  initialData,
  snippetId,
  onSuccess,
}: SnippetFormDialogProps) => {
  const [form, setForm] = useState<FormState>(defaultInitialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, startTransition] = useTransition();

  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const [codeMode, setCodeMode] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        setForm(initialData);
      } else {
        setForm(defaultInitialState);
      }
      setErrors({});
      setCodeMode("edit");
    }
  }, [open, mode, initialData]);

  useEffect(() => {
    if (!langOpen) return;
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [langOpen]);

  const handleChange = useCallback(
    (field: keyof FormState) =>
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      },
    [],
  );

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.title.trim()) errs.title = "Title is required.";
    else if (form.title.length > 100) errs.title = "Max 100 characters.";

    if (!form.description.trim()) errs.description = "Description is required.";
    else if (form.description.length > 500)
      errs.description = "Max 500 characters.";

    if (!form.language) errs.language = "Language is required.";
    if (!form.code.trim()) errs.code = "Code is required.";

    if (form.tags) {
      const tagList = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      if (tagList.length > 10) errs.tags = "Maximum 10 tags allowed.";
      else if (tagList.some((t) => t.length > 30))
        errs.tags = "Each tag must be 30 chars or fewer.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    startTransition(async () => {
      try {
        if (mode === "add") {
          const res = await createSnippetAction({
            title: form.title,
            description: form.description,
            code: form.code,
            language: form.language,
            tags: form.tags,
            isPublic: form.isPublic,
          });

          if (res.error) {
            toast.error(res.error, {
              description: res.details
                ? "Please verify all fields."
                : "Could not complete request.",
            });
            return;
          }
          toast.success("Snippet added successfully!");
        } else {
          // Edit mode API call
          const res = await fetch(`/api/snippet/${snippetId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          });

          if (!res.ok) {
            const errText = await res.text();
            throw new Error(errText);
          }
          toast.success("Snippet updated successfully!");
        }

        onOpenChange(false);
        if (onSuccess) onSuccess();
      } catch (err) {
        toast.error("Something went wrong.", {
          description: err instanceof Error ? err.message : "Please try again.",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl w-full p-0! gap-0 border-none bg-background shadow-lg overflow-hidden">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full max-h-[85vh]"
        >
          <DialogHeader
            className="px-6 pt-6 pb-4 shrink-0 border-b border-border/50 bg-muted/10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, color-mix(in srgb, var(--foreground) 2.5%, transparent) 0, color-mix(in srgb, var(--foreground) 2.5%, transparent) 1px, transparent 1px, transparent 5px), repeating-linear-gradient(-45deg, color-mix(in srgb, var(--foreground) 2.5%, transparent) 0, color-mix(in srgb, var(--foreground) 2.5%, transparent) 1px, transparent 1px, transparent 5px)",
            }}
          >
            <DialogTitle>
              {mode === "add" ? "Add Code Snippet" : "Edit Code Snippet"}
            </DialogTitle>
            <DialogDescription>
              {mode === "add"
                ? "Add a new code snippet to your collection."
                : "Update your snippet details below."}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="min-h-0">
            <div className="px-6 py-5">
              <FieldGroup>
                <Field>
                  <Label htmlFor="title">Title</Label>
                  <InputGroup>
                    <InputGroupAddon>
                      <PencilIcon weight="duotone" />
                    </InputGroupAddon>
                    <InputGroupInput
                      type="text"
                      id="title"
                      name="title"
                      placeholder="Enter snippet title..."
                      value={form.title}
                      onChange={handleChange("title")}
                      aria-invalid={!!errors.title}
                      disabled={isPending}
                    />
                  </InputGroup>
                  {errors.title && <FieldError>{errors.title}</FieldError>}
                </Field>

                {/* Description */}
                <Field>
                  <Label htmlFor="description">Description</Label>
                  <InputGroup>
                    <InputGroupAddon>
                      <PencilIcon weight="duotone" />
                    </InputGroupAddon>
                    <InputGroupInput
                      type="text"
                      id="description"
                      name="description"
                      placeholder="Brief description of what this snippet does..."
                      value={form.description}
                      onChange={handleChange("description")}
                      aria-invalid={!!errors.description}
                      disabled={isPending}
                    />
                  </InputGroup>
                  {errors.description && (
                    <FieldError>{errors.description}</FieldError>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="lang-trigger">Language</Label>

                  <div ref={langRef} className="relative">
                    <button
                      id="lang-trigger"
                      type="button"
                      disabled={isPending}
                      onClick={() => setLangOpen((v) => !v)}
                      aria-expanded={langOpen}
                      className={cn(
                        "flex h-8 w-full items-center justify-between rounded-none border border-input bg-transparent px-3 text-xs font-normal text-foreground transition-colors",
                        "hover:border-ring/60 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        langOpen && "border-ring ring-1 ring-ring/50",
                        errors.language && "border-destructive",
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                        {langLabel(form.language)}
                      </span>
                      <CaretUpDownIcon
                        className={cn(
                          "size-3.5 text-muted-foreground transition-transform duration-150",
                          langOpen && "rotate-180",
                        )}
                      />
                    </button>

                    {langOpen && (
                      <div className="absolute left-0 right-0 top-[calc(100%+2px)] z-50 rounded-none border border-border bg-popover shadow-md ring-1 ring-foreground/10">
                        <Command className="rounded-none">
                          <CommandInput placeholder="Search language..." />
                          <CommandList className="max-h-52">
                            <CommandEmpty>No language found.</CommandEmpty>
                            <CommandGroup>
                              {SUPPORTED_LANGUAGES.map((lang) => (
                                <CommandItem
                                  key={lang}
                                  value={lang}
                                  data-checked={form.language === lang}
                                  onSelect={() => {
                                    setForm((prev) => ({
                                      ...prev,
                                      language: lang as Language,
                                    }));
                                    setErrors((prev) => ({
                                      ...prev,
                                      language: undefined,
                                    }));
                                    setLangOpen(false);
                                  }}
                                >
                                  {langLabel(lang)}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </div>
                    )}
                  </div>

                  {errors.language && (
                    <FieldError>{errors.language}</FieldError>
                  )}
                </Field>

                <Field>
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="code">Code</Label>

                    <div className="flex items-center rounded-none border border-border overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setCodeMode("edit")}
                        className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-medium transition-colors cursor-pointer",
                          codeMode === "edit"
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        )}
                      >
                        <PencilSimpleIcon className="size-3" />
                        Edit
                      </button>
                      <div className="w-px h-4 bg-border" />
                      <button
                        type="button"
                        onClick={() => {
                          if (!form.code.trim()) return;
                          setCodeMode("preview");
                        }}
                        disabled={!form.code.trim()}
                        className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-medium transition-colors cursor-pointer",
                          codeMode === "preview"
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                          !form.code.trim() && "opacity-40 cursor-not-allowed",
                        )}
                      >
                        <EyeIcon className="size-3" />
                        Preview
                      </button>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "rounded-none border overflow-hidden transition-colors",
                      errors.code
                        ? "border-destructive ring-1 ring-destructive/20"
                        : "border-input focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/50",
                    )}
                  >
                    <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border/40 bg-muted/30">
                      <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                        {form.language}
                      </span>
                    </div>

                    {codeMode === "edit" && (
                      <textarea
                        id="code"
                        name="code"
                        value={form.code}
                        onChange={handleChange("code")}
                        placeholder="Paste or type your code here..."
                        disabled={isPending}
                        spellCheck={false}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        rows={10}
                        style={{
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: "12px",
                          lineHeight: "1.65",
                          tabSize: 2,
                        }}
                        className="w-full resize-none bg-transparent px-4 py-3 text-xs outline-none placeholder:text-muted-foreground/40 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    )}

                    {codeMode === "preview" && (
                      <div className="overflow-x-auto">
                        <SyntaxHighlighter
                          language={form.language}
                          style={cleanOneDark}
                          wrapLongLines={true}
                          customStyle={{
                            margin: 0,
                            borderRadius: 0,
                            padding: "12px 16px",
                            fontFamily: "var(--font-fira-code), monospace",
                            fontSize: "12px",
                            lineHeight: "1.65",
                            background: "transparent",
                            minHeight: "calc(10 * 1.65 * 12px + 24px)",
                          }}
                          codeTagProps={{
                            style: {
                              fontFamily:
                                "'JetBrains Mono','Fira Code',Consolas,monospace",
                            },
                          }}
                        >
                          {form.code}
                        </SyntaxHighlighter>
                      </div>
                    )}
                  </div>

                  {errors.code && <FieldError>{errors.code}</FieldError>}
                </Field>

                <Field>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="public">Make it public</Label>
                    <Switch
                      id="public"
                      checked={form.isPublic}
                      onCheckedChange={(checked) =>
                        setForm((prev) => ({ ...prev, isPublic: checked }))
                      }
                      disabled={isPending}
                    />
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-0.5">
                    When checked, this snippet will be visible to other users.
                  </p>
                </Field>

                <Field>
                  <Label htmlFor="tags">Tags</Label>
                  <InputGroup>
                    <InputGroupAddon>
                      <TagIcon weight="duotone" />
                    </InputGroupAddon>
                    <InputGroupInput
                      type="text"
                      id="tags"
                      name="tags"
                      placeholder="react, hooks, typescript..."
                      value={form.tags}
                      onChange={handleChange("tags")}
                      aria-invalid={!!errors.tags}
                      disabled={isPending}
                    />
                  </InputGroup>
                  <p className="text-[9px] text-muted-foreground mt-0.5">
                    Comma-separated. Max&nbsp;10 tags, 30&nbsp;chars each.
                  </p>
                  {errors.tags && <FieldError>{errors.tags}</FieldError>}
                </Field>
              </FieldGroup>
            </div>
          </ScrollArea>

          <DialogFooter
            className="px-6 py-4 shrink-0 border-t border-border/50 bg-muted/10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, color-mix(in srgb, var(--foreground) 2.5%, transparent) 0, color-mix(in srgb, var(--foreground) 2.5%, transparent) 1px, transparent 1px, transparent 5px), repeating-linear-gradient(-45deg, color-mix(in srgb, var(--foreground) 2.5%, transparent) 0, color-mix(in srgb, var(--foreground) 2.5%, transparent) 1px, transparent 1px, transparent 5px)",
            }}
          >
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                disabled={isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={isPending}
            >
              {isPending
                ? "Saving..."
                : mode === "add"
                  ? "Save Snippet"
                  : "Update Snippet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
