import { Section } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/Skeleton";

// Next.js App Router convention file — automatically shown via Suspense
// while ShopPage's async data fetch (getProducts/getCategories) is in
// flight. Instant today against the in-memory mock catalog, but this is
// real infrastructure: it activates meaningfully the moment a real
// WooCommerce API call introduces actual network latency.
export default function ShopLoading() {
  return (
    <>
      <Skeleton className="h-[42vh] min-h-[320px] w-full rounded-none sm:h-[50vh]" />
      <Section spacing="tight" className="pb-24 pt-10">
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-9 w-24 rounded-full" />
          ))}
        </div>
        <Skeleton className="mt-6 h-28 w-full sm:h-36" />
        <div className="mt-8 flex items-center justify-between">
          <Skeleton className="h-11 w-full max-w-xs" />
          <Skeleton className="h-11 w-40" />
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index}>
              <Skeleton className="aspect-[3/4] w-full rounded-none" />
              <Skeleton className="mt-3 h-4 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/3" />
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
