import { cn } from "@/lib/utils";

export function CheckoutProgress({ currentStep, steps }: { currentStep: number; steps: string[] }) {
  return (
    <ol className="flex items-center gap-3">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isDone = stepNumber < currentStep;
        return (
          <li key={step} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors",
                  isActive || isDone ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                )}
              >
                {isDone ? "✓" : stepNumber}
              </span>
              <span className={cn("text-sm", isActive ? "text-foreground" : "text-muted-foreground")}>{step}</span>
            </div>
            {index < steps.length - 1 ? <span className="h-px w-8 bg-border sm:w-12" /> : null}
          </li>
        );
      })}
    </ol>
  );
}
