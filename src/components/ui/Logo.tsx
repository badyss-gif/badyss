import Image from "next/image";
import { cn } from "@/lib/utils";

// Source files are cropped tight to the mark's content box (771×255,
// ~3.02:1) — the original 902×276 exports had ~15% dead transparent margin,
// which made the logo read as noticeably smaller than its container height
// actually allowed. width/height below only set the intrinsic ratio Next
// uses for layout; actual rendered size comes from the className (h-* +
// w-auto).
const LOGO_WIDTH = 771;
const LOGO_HEIGHT = 255;

type LogoVariant = "black" | "white" | "auto";

interface LogoProps {
  /**
   * "black"/"white" force a fixed mark. "auto" picks black in light color
   * scheme and white in dark — for surfaces whose own background flips with
   * `prefers-color-scheme` (see globals.css), so the mark stays legible
   * either way without needing client JS.
   */
  variant?: LogoVariant;
  className?: string;
  /** Only the Header's copy is above-the-fold/LCP-adjacent on every page — Footer/NavOverlay should stay lazy. Defaults to false. */
  priority?: boolean;
}

export function Logo({ variant = "auto", className, priority = false }: LogoProps) {
  if (variant === "auto") {
    return (
      <span className={cn("relative inline-block", className)}>
        <Image
          src="/images/logo/badyss-logo-black.png"
          alt="BADYSS"
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          priority={priority}
          className="h-full w-auto [@media(prefers-color-scheme:dark)]:hidden"
        />
        <Image
          src="/images/logo/badyss-logo-white.png"
          alt="BADYSS"
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          priority={priority}
          className="hidden h-full w-auto [@media(prefers-color-scheme:dark)]:block"
        />
      </span>
    );
  }

  return (
    <Image
      src={`/images/logo/badyss-logo-${variant}.png`}
      alt="BADYSS"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      className={cn("h-full w-auto", className)}
    />
  );
}
