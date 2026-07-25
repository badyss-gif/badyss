import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

type SectionSpacing = "default" | "editorial" | "tight";
type SectionTone = "default" | "inverse";

interface SectionProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  withContainer?: boolean;
  spacing?: SectionSpacing;
  tone?: SectionTone;
}

// Spacing philosophy: commerce sections (product grids) use tighter rhythm;
// editorial/storytelling sections get deliberately generous whitespace.
const spacingStyles: Record<SectionSpacing, string> = {
  tight: "py-8 sm:py-10",
  default: "py-12 sm:py-16 lg:py-20",
  editorial: "py-20 sm:py-28 lg:py-36",
};

const toneStyles: Record<SectionTone, string> = {
  default: "",
  inverse: "bg-inverse text-inverse-foreground",
};

export function Section({
  children,
  className,
  containerClassName,
  withContainer = true,
  spacing = "default",
  tone = "default",
}: SectionProps) {
  return (
    <section className={cn(spacingStyles[spacing], toneStyles[tone], className)}>
      {withContainer ? <Container className={containerClassName}>{children}</Container> : children}
    </section>
  );
}
