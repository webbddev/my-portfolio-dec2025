"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost" // Use ghost to remove default button background and border
      size="icon"
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className="size-9 md:size-11 rounded-full border border-stone-400 bg-stone-200 hover:bg-slate-300 dark:bg-stone-600/50 dark:border-stone-400 dark:hover:bg-stone-700 dark:text-stone-200 transition-colors duration-700 ease-in-out"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-transform duration-700 ease-in-out dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-transform duration-700 ease-in-out dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
