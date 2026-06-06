import type { Metadata } from "next";
import { Fira_Code, Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import GlobalProvider from "@/providers/global-provider";

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "cachecode",
  description:
    "A professional community for sharing coding best practices and developer snippets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full overscroll-none",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        jetbrainsMono.variable,
        firaCode.variable,
      )}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <GlobalProvider>{children}</GlobalProvider>
        <Toaster position="bottom-right" duration={3000} />
      </body>
    </html>
  );
}
