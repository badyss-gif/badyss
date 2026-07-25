import Image from "next/image";
import type { ProductImage as ProductImageType } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  image: ProductImageType | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Renders a REAL WooCommerce product image only. Never use this for
 * AI-generated creative/editorial visuals — see ui/CreativeVisual for those.
 * Image `src` domain is not yet configured in next.config.ts remotePatterns
 * because the WordPress media host is unknown (NOT_VERIFIED) — add it once
 * backend access confirms the real domain.
 */
export function ProductImage({
  image,
  className,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority,
}: ProductImageProps) {
  if (!image) {
    // Same diagonal placeholder language as CreativeVisual — reads as "photo
    // pending," not a broken/empty box. A flat bg-muted rectangle here (the
    // previous treatment) looked broken at the large sizes some layouts use.
    return (
      <div
        className={cn(
          "aspect-[3/4] w-full bg-[repeating-linear-gradient(135deg,var(--color-muted),var(--color-muted)_10px,var(--color-border)_10px,var(--color-border)_11px)]",
          className
        )}
        aria-hidden
      />
    );
  }

  return (
    <div className={cn("relative aspect-[3/4] w-full overflow-hidden bg-muted", className)}>
      <Image src={image.url} alt={image.alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
