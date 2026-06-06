"use client";

import {
  CheckCircleIcon,
  InfoIcon,
  SpinnerIcon,
  WarningIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <>
      <style>{`
        /* Force sharp corners on all toast elements */
        [data-sonner-toast],
        [data-sonner-toast] [data-content],
        [data-sonner-toast] [data-icon] {
          border-radius: 0 !important;
        }

        /* Hide the default circular SVG icon inside close button */
        [data-close-button] > svg {
          display: none !important;
        }
        /* Make close button a text button, square corners */
        [data-close-button] {
          position: absolute !important;
          left: auto !important;
          right: 8px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          background: transparent !important;
          border: 1px solid color-mix(in srgb, currentColor 20%, transparent) !important;
          border-radius: 0 !important;
          padding: 2px 8px !important;
          font-size: 11px !important;
          font-family: inherit !important;
          color: inherit !important;
          opacity: 0.6;
          cursor: pointer;
          transition: opacity 0.15s;
          width: auto !important;
          height: auto !important;
        }
        [data-close-button]:hover {
          opacity: 1;
        }
        /* Inject the "Close" text */
        [data-close-button]::after {
          content: "Close";
        }
      `}</style>
      <Sonner
        theme={theme as ToasterProps["theme"]}
        className="toaster group"
        closeButton
        icons={{
          success: <CheckCircleIcon className="size-4" />,
          info: <InfoIcon className="size-4" />,
          warning: <WarningIcon className="size-4" />,
          error: <XCircleIcon className="size-4" />,
          loading: <SpinnerIcon className="size-4 animate-spin" />,
        }}
        style={
          {
            "--normal-bg": "var(--popover)",
            "--normal-text": "var(--popover-foreground)",
            "--normal-border": "var(--border)",
            "--border-radius": "0",
          } as React.CSSProperties
        }
        toastOptions={{
          classNames: {
            toast: "cn-toast relative !pr-20 !rounded-none",
          },
        }}
        {...props}
      />
    </>
  );
};

export { Toaster };
