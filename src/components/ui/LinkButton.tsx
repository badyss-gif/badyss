import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonStyles, type ButtonSize, type ButtonVariant } from "./Button";

interface LinkButtonProps extends ComponentProps<typeof Link> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

// Same visual language as Button, but a real <a> (via next/link) for
// navigation — never nest a Link inside a <button>.
export function LinkButton({ variant = "primary", size = "md", className, ...props }: LinkButtonProps) {
  return <Link className={buttonStyles(variant, size, className)} {...props} />;
}
