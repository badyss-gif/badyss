import type { InputHTMLAttributes, Ref } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & { ref?: Ref<HTMLInputElement> };

// Sharp corners (rounded-none), consistent with the system's image/surface
// treatment — radius is reserved for buttons/pills, not structural elements.
// `ref` accepted as a plain prop (React 19 — no `forwardRef` needed) so
// callers can imperatively focus the input (e.g. the search overlay).
export function Input({ className, ref, ...props }: InputProps) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-none border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground",
        "transition-colors focus-visible:border-accent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
