import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextLink } from "@/components/ui/TextLink";
import { Skeleton } from "@/components/ui/Skeleton";
import { CreativeVisual } from "@/components/ui/CreativeVisual";
import { ProductCard } from "@/components/commerce/ProductCard";
import { ProductImage } from "@/components/commerce/ProductImage";
import { Reveal } from "@/components/motion/Reveal";
import { DISABLED_BADYSS_OFFER } from "@/lib/woocommerce/transform";
import type { Product } from "@/types/product";

// Internal, development-only visual validation route — not part of the
// customer-facing site. Excluded from robots.txt and marked noindex here as
// a redundant safety net. Everything on this page is PROPOSED design
// direction pending your approval, not a final page.
export const metadata: Metadata = {
  title: "Design System",
  robots: { index: false, follow: false },
};

const colorTokens = [
  { name: "background", className: "bg-background border border-border" },
  { name: "foreground", className: "bg-foreground" },
  { name: "muted", className: "bg-muted border border-border" },
  { name: "muted-foreground", className: "bg-muted-foreground" },
  { name: "surface", className: "bg-surface border border-border" },
  { name: "border", className: "bg-border" },
  { name: "accent", className: "bg-accent" },
  { name: "accent-foreground", className: "bg-accent-foreground border border-border" },
  { name: "inverse", className: "bg-inverse" },
  { name: "success", className: "bg-success" },
  { name: "error", className: "bg-error" },
];

// Clearly-labeled mock data for this showcase only — not real BADYSS
// catalog data. Uses only fields that exist on the domain Product type.
const mockProducts: Product[] = [
  {
    id: 1,
    slug: "sample-product-one",
    name: "Sample Product One (mock)",
    description: "",
    shortDescription: "",
    sku: "MOCK-001",
    price: { amount: 249, currency: "MAD", onSale: false },
    stock: { status: "in-stock" },
    images: [],
    categories: [],
    attributes: [{ name: "Couleur", options: ["Noir", "Blanc"], usedForVariations: true }],
    type: "simple",
    featured: false,
    badyssOffer: DISABLED_BADYSS_OFFER,
  },
  {
    id: 2,
    slug: "sample-product-two",
    name: "Sample Product Two (mock)",
    description: "",
    shortDescription: "",
    sku: "MOCK-002",
    price: { amount: 199, currency: "MAD", onSale: true, regularAmount: 299 },
    stock: { status: "in-stock" },
    images: [],
    categories: [],
    attributes: [],
    type: "simple",
    featured: false,
    badyssOffer: DISABLED_BADYSS_OFFER,
  },
  {
    id: 3,
    slug: "sample-product-three",
    name: "Sample Product Three (mock)",
    description: "",
    shortDescription: "",
    sku: "MOCK-003",
    price: { amount: 349, currency: "MAD", onSale: false },
    stock: { status: "out-of-stock" },
    images: [],
    categories: [],
    attributes: [{ name: "Taille", options: ["S", "M", "L"], usedForVariations: true }],
    type: "simple",
    featured: false,
    badyssOffer: DISABLED_BADYSS_OFFER,
  },
  {
    id: 4,
    slug: "sample-product-four",
    name: "Sample Product Four (mock)",
    description: "",
    shortDescription: "",
    sku: "MOCK-004",
    price: { amount: 279, currency: "MAD", onSale: false },
    stock: { status: "in-stock" },
    badyssOffer: DISABLED_BADYSS_OFFER,
    images: [],
    categories: [],
    attributes: [],
    type: "simple",
    featured: false,
  },
];

function SwatchLabel({ children }: { children: string }) {
  return <p className="mt-2 font-mono text-xs text-muted-foreground">{children}</p>;
}

export default function DesignSystemPage() {
  return (
    <div className="pb-32">
      <Section spacing="tight" className="border-b border-border">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Internal only — not the customer-facing site
        </p>
        <h1 className="font-display text-display-md font-extrabold tracking-tight">
          BADYSS Design System
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Phase 1 creative direction validation. Every value here is PROPOSED, pending your
          approval — nothing on this page is final brand identity.
        </p>
      </Section>

      <Section>
        <h2 className="font-display text-display-sm font-extrabold">Colors</h2>
        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {colorTokens.map((token) => (
            <div key={token.name}>
              <div className={`aspect-square w-full ${token.className}`} />
              <SwatchLabel>{token.name}</SwatchLabel>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="inverse">
        <h2 className="font-display text-display-sm font-extrabold">Typography</h2>
        <div className="mt-8 space-y-6">
          <p className="font-display text-display-xl font-extrabold tracking-tight">
            Display XL — Nouvelle Collection
          </p>
          <p className="font-display text-display-lg font-extrabold tracking-tight">
            Display LG — Style au Quotidien
          </p>
          <p className="font-display text-display-md font-bold">Display MD — Nouveautés</p>
          <p className="font-display text-display-sm font-bold">Display SM — Meilleures Ventes</p>
          <p className="max-w-xl text-lg">
            Body large — texte courant utilisé pour l&apos;introduction des sections éditoriales et
            la description longue des produits.
          </p>
          <p className="max-w-xl text-inverse-foreground/80">
            Body base — texte standard pour le contenu, les descriptions et les paragraphes
            généraux du site.
          </p>
          <p className="text-sm text-inverse-foreground/60">
            Body small — métadonnées, légendes, informations secondaires.
          </p>
        </div>
      </Section>

      <Section>
        <h2 className="font-display text-display-sm font-extrabold">Buttons</h2>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="lg">
            Large
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button variant="primary" loading>
            Loading
          </Button>
        </div>
      </Section>

      <Section spacing="tight">
        <h2 className="font-display text-display-sm font-extrabold">Links &amp; Inputs</h2>
        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
          <TextLink href="/">Example text link</TextLink>
          <div className="w-full max-w-xs space-y-3">
            <Input placeholder="Adresse e-mail" />
            <Input placeholder="Champ désactivé" disabled />
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="font-display text-display-sm font-extrabold">Product Image (empty state)</h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          No live WooCommerce images exist yet — this shows the real fallback state
          `ProductImage` renders when no image is available, not a fake photo.
        </p>
        <div className="mt-6 max-w-xs">
          <ProductImage image={null} />
        </div>
      </Section>

      <Section tone="inverse">
        <h2 className="font-display text-display-sm font-extrabold">Editorial Visual System</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <CreativeVisual kind="hero" aspect="hero" overlay="scrim-bottom" contentPosition="bottom-left">
            <span className="font-display text-2xl font-extrabold text-white">Hero visual</span>
          </CreativeVisual>
          <CreativeVisual kind="campaign" aspect="tall" overlay="scrim-full" contentPosition="center">
            <span className="font-display text-xl font-extrabold text-white">Campaign visual</span>
          </CreativeVisual>
          <CreativeVisual kind="editorial" aspect="square" label="Editorial visual placeholder" />
        </div>
      </Section>

      <Section>
        <h2 className="font-display text-display-sm font-extrabold">Product Card Prototype</h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Mock data only — labeled &ldquo;(mock)&rdquo; below, not real BADYSS catalog data.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Section>

      <Section spacing="tight">
        <h2 className="font-display text-display-sm font-extrabold">Containers &amp; Section Spacing</h2>
        <div className="mt-6 space-y-2 text-sm text-muted-foreground">
          <p>This block uses `spacing=&quot;tight&quot;` — commerce/grid rhythm.</p>
        </div>
      </Section>
      <Section spacing="editorial" className="border-y border-border">
        <p className="text-sm text-muted-foreground">
          This block uses `spacing=&quot;editorial&quot;` — generous storytelling rhythm.
        </p>
      </Section>

      <Section>
        <h2 className="font-display text-display-sm font-extrabold">Loading Skeletons</h2>
        <div className="mt-6 max-w-sm space-y-3">
          <Skeleton className="aspect-[3/4] w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </Section>

      <Section>
        <h2 className="font-display text-display-sm font-extrabold">Motion (scroll to trigger)</h2>
        <div className="mt-6 space-y-24">
          <Reveal>
            <div className="bg-muted p-8">Reveal 1 — fades and slides in on scroll.</div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="bg-muted p-8">Reveal 2 — slightly delayed for stagger.</div>
          </Reveal>
        </div>
      </Section>

      <Container>
        <p className="text-xs text-muted-foreground">
          Container primitive: max-width + responsive horizontal padding, visible via this text
          block&apos;s alignment against the viewport edge.
        </p>
      </Container>
    </div>
  );
}
