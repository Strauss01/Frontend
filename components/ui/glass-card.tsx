import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl glass shadow-lg transition-all duration-300",
        className
      )}
      {...props}
    />
  );
}