import { Section } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CategoryLoading() {
  return (
    <Section spacing="tight" className="pt-24 lg:pt-28">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-4 h-10 w-1/2 max-w-md" />
      <Skeleton className="mt-4 h-5 w-2/3 max-w-lg" />
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
  );
}
