import Image from "next/image";

interface CategoryHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  variant: "full-bleed" | "split" | "typographic";
  image?: { src: string; alt: string };
  imagePosition?: "left" | "right";
}

// Three distinct treatments so category pages don't all share one template —
// which one a category gets is a deliberate editorial choice (see the page
// that calls this), not random variation.
export function CategoryHero({
  eyebrow,
  title,
  description,
  variant,
  image,
  imagePosition = "left",
}: CategoryHeroProps) {
  if (variant === "full-bleed" && image) {
    return (
      <div className="relative flex min-h-[70vh] w-full items-end overflow-hidden bg-foreground sm:min-h-[80vh]">
        <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/30" />
        <div className="relative z-10 w-full px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">{eyebrow}</p>
          <h1 className="mt-3 max-w-xl font-display text-display-lg font-extrabold leading-[0.95] tracking-tight text-white sm:text-display-xl">
            {title}
          </h1>
          <p className="mt-4 max-w-md text-white/85">{description}</p>
        </div>
      </div>
    );
  }

  if (variant === "split" && image) {
    const imageBlock = (
      <div className="relative aspect-[4/3] sm:aspect-auto sm:min-h-[60vh]">
        <Image src={image.src} alt={image.alt} fill sizes="(min-width: 640px) 50vw, 100vw" priority className="object-cover" />
      </div>
    );
    const textBlock = (
      <div className="flex flex-col justify-center px-4 py-12 sm:px-10 sm:py-0 lg:px-16">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{eyebrow}</p>
        <h1 className="mt-3 font-display text-display-lg font-extrabold leading-[0.95] tracking-tight sm:text-display-xl">
          {title}
        </h1>
        <p className="mt-4 max-w-sm text-muted-foreground">{description}</p>
      </div>
    );
    return (
      <div className="grid w-full grid-cols-1 sm:grid-cols-2">
        {imagePosition === "left" ? (
          <>
            {imageBlock}
            {textBlock}
          </>
        ) : (
          <>
            <div className="sm:order-2">{imageBlock}</div>
            <div className="sm:order-1">{textBlock}</div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="border-b border-border px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{eyebrow}</p>
      <h1 className="mt-3 max-w-xl font-display text-display-lg font-extrabold leading-[0.95] tracking-tight sm:text-display-xl">
        {title}
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">{description}</p>
    </div>
  );
}
