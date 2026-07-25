import { Section } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/Skeleton";

// Shown via Suspense while ProductPage's async fetch is in flight — same
// real-infrastructure rationale as shop/loading.tsx.
export default function ProductLoading() {
  return (
    <Section spacing="tight" className="pt-24 lg:pt-28">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Skeleton className="aspect-[3/4] w-full rounded-none" />
        <div className="flex flex-col gap-6">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-24" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-14 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
    </Section>
  );
}
