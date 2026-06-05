import type React from "react";
import { ThemeProvider } from "./theme-provider";

type Props = {
  children: React.ReactNode;
};

function GlobalProvider({ children }: Props) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

export default GlobalProvider;
