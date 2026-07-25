import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type CreativeVisualKind = "hero" | "editorial" | "campaign" | "background";
type AspectPreset = "portrait" | "tall" | "hero" | "square" | "wide" | "campaign-wide";
type Overlay = "none" | "scrim-bottom" | "scrim-full";
type ContentPosition = "bottom-left" | "bottom-center" | "center";

interface CreativeVisualImage {
  src: string;
  alt: string;
  priority?: boolean;
}

interface CreativeVisualProps {
  kind?: CreativeVisualKind;
  label?: string;
  aspect?: AspectPreset;
  overlay?: Overlay;
  contentPosition?: ContentPosition;
  /** CSS object-position value, for real images that need a specific focal point. */
  focalPoint?: string;
  /** Real image — when omitted, renders the placeholder pattern instead. */
  image?: CreativeVisualImage;
  /** Optional distinct mobile crop (art direction, not the same photo squeezed). Ignored if `image` isn't set. */
  mobileImage?: CreativeVisualImage;
  /** Opt-in slow scale drift on load — hero only, never the default. Respects prefers-reduced-motion via CSS. */
  driftOnLoad?: boolean;
  children?: ReactNode;
  className?: string;
}

// Aspect classes are written out in full (not built from interpolated
// strings) so Tailwind's static source scanner can detect and generate them —
// a dynamically-composed `aspect-[${x}]` class would silently fail to build.
const aspectPresets: Record<AspectPreset, string> = {
  portrait: "aspect-[3/4]",
  tall: "aspect-[4/5] md:aspect-[3/4]",
  hero: "aspect-[4/5] md:aspect-[16/9]",
  square: "aspect-square",
  wide: "aspect-[16/9]",
  // Deliberately wider/more cinematic than "tall" — reserved for sections
  // that need stronger visual hierarchy than a standard editorial split
  // (approved: Grandes Tailles gets this treatment, see LargeSizeCollection).
  "campaign-wide": "aspect-[4/5] md:aspect-[21/9]",
};

const overlayClasses: Record<Overlay, string> = {
  none: "",
  "scrim-bottom": "bg-gradient-to-t from-black/60 via-black/10 to-transparent",
  "scrim-full": "bg-black/30",
};

const contentPositionClasses: Record<ContentPosition, string> = {
  "bottom-left": "items-end justify-start text-left",
  "bottom-center": "items-end justify-center text-center",
  center: "items-center justify-center text-center",
};

function VisualImage({
  image,
  focalPoint,
  driftOnLoad,
  responsiveClassName,
}: {
  image: CreativeVisualImage;
  focalPoint?: string;
  driftOnLoad?: boolean;
  responsiveClassName?: string;
}) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      priority={image.priority}
      sizes="100vw"
      style={focalPoint ? { objectPosition: focalPoint } : undefined}
      className={cn("object-cover", driftOnLoad && "hero-image-drift", responsiveClassName)}
    />
  );
}

/**
 * Renders either a real creative/editorial image (fal.ai-generated) or, when
 * none is provided yet, the placeholder pattern used during development.
 * Real product photography never goes through this component — see
 * components/commerce/ProductImage for that.
 */
export function CreativeVisual({
  kind = "editorial",
  label,
  aspect = "portrait",
  overlay = "none",
  contentPosition = "bottom-left",
  focalPoint,
  image,
  mobileImage,
  driftOnLoad = false,
  children,
  className,
}: CreativeVisualProps) {
  return (
    <div
      {...(!image ? { role: "img", "aria-label": label ?? `${kind} visual placeholder` } : {})}
      className={cn(
        "relative flex overflow-hidden",
        !image &&
          "bg-[repeating-linear-gradient(135deg,var(--color-muted),var(--color-muted)_10px,var(--color-border)_10px,var(--color-border)_11px)]",
        aspectPresets[aspect],
        className
      )}
    >
      {image ? (
        mobileImage ? (
          <>
            <VisualImage
              image={mobileImage}
              focalPoint={focalPoint}
              driftOnLoad={driftOnLoad}
              responsiveClassName="md:hidden"
            />
            <VisualImage
              image={image}
              focalPoint={focalPoint}
              driftOnLoad={driftOnLoad}
              responsiveClassName="hidden md:block"
            />
          </>
        ) : (
          <VisualImage image={image} focalPoint={focalPoint} driftOnLoad={driftOnLoad} />
        )
      ) : null}
      {overlay !== "none" ? <div className={cn("absolute inset-0", overlayClasses[overlay])} /> : null}
      {children ? (
        <div className={cn("relative z-10 flex w-full p-6", contentPositionClasses[contentPosition])}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
