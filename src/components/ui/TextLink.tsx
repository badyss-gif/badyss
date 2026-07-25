import NextLink from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type TextLinkProps = ComponentProps<typeof NextLink>;

export function TextLink({ className, ...props }: TextLinkProps) {
  return (
    <NextLink
      className={cn(
        "underline decoration-border underline-offset-4 transition-colors hover:decoration-accent hover:text-accent",
        className
      )}
      {...props}
    />
  );
}
