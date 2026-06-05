"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signIn, signUp } from "@/lib/auth-client";

const signupBaseSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must be at most 50 characters."),
  email: z.email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be at most 72 characters."),
  confirmPassword: z.string(),
});

const signupSchema = signupBaseSchema.refine(
  (data) => data.password === data.confirmPassword,
  { message: "Passwords do not match.", path: ["confirmPassword"] },
);

function FieldError({ errors }: { errors: any[] }) {
  if (!errors.length) return null;
  const error = errors[0];
  const message =
    typeof error === "string" ? error : error?.message || String(error);
  return (
    <p className="text-[11px] text-destructive leading-tight">{message}</p>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [githubLoading, setGithubLoading] = useState(false);

  const form = useForm({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    validators: { onSubmit: signupSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const { error } = await signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
      });
      if (error) {
        setServerError(error.message ?? "Could not create account. Try again.");
      } else {
        router.push("/login");
      }
    },
  });

  const handleGitHubSignIn = async () => {
    setGithubLoading(true);
    await signIn.social({ provider: "github", callbackURL: "/explore" });
    setGithubLoading(false);
  };

  return (
    <div className="w-full border border-border">
      <div className="border-b border-border px-6 py-5">
        <h1 className="text-xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Join cachecode and start sharing your snippets
        </p>
      </div>
      <div className="px-6 py-6 flex flex-col gap-5">
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          onClick={handleGitHubSignIn}
          disabled={githubLoading}
        >
          {githubLoading ? (
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <GitHubIcon className="size-4" />
          )}
          Continue with GitHub
        </Button>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
            or
          </span>
          <Separator className="flex-1" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          noValidate
          className="flex flex-col gap-4"
        >
          <form.Field
            name="name"
            validators={{ onBlur: signupBaseSchema.shape.name }}
          >
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor={field.name}
                    className={isInvalid ? "text-destructive" : ""}
                  >
                    Name
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder="Ada Lovelace"
                    autoComplete="name"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </div>
              );
            }}
          </form.Field>
          <form.Field
            name="email"
            validators={{ onBlur: signupBaseSchema.shape.email }}
          >
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor={field.name}
                    className={isInvalid ? "text-destructive" : ""}
                  >
                    Email
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </div>
              );
            }}
          </form.Field>

          <form.Field
            name="password"
            validators={{ onBlur: signupBaseSchema.shape.password }}
          >
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor={field.name}
                    className={isInvalid ? "text-destructive" : ""}
                  >
                    Password
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </div>
              );
            }}
          </form.Field>

          <form.Field
            name="confirmPassword"
            validators={{
              onBlurListenTo: ["password"],
              onBlur: ({ value, fieldApi }) => {
                const password = fieldApi.form.getFieldValue("password");
                if (value !== password) return "Passwords do not match.";
                return undefined;
              },
            }}
          >
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor={field.name}
                    className={isInvalid ? "text-destructive" : ""}
                  >
                    Confirm password
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </div>
              );
            }}
          </form.Field>

          {serverError && (
            <div className="border border-destructive/30 bg-destructive/5 px-3 py-2">
              <p className="text-[11px] text-destructive">{serverError}</p>
            </div>
          )}

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                className="w-full"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating account…
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            )}
          </form.Subscribe>

          <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
            By creating an account you agree to our{" "}
            <span className="text-foreground">Terms of Service</span> and{" "}
            <span className="text-foreground">Privacy Policy</span>.
          </p>
        </form>
      </div>

      <div className="border-t border-border px-6 py-4 bg-muted/30">
        <p className="text-[11px] text-muted-foreground text-center">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-foreground font-medium hover:underline underline-offset-4 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
