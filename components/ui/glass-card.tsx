import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  layer?: "authority" | "reasoning" | "risk" | "none";
  hover?: boolean;
}

export function GlassCard({
  className,
  layer = "none",
  hover = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-2xl",
        layer === "authority" && "layer-authority",
        layer === "reasoning" && "layer-reasoning",
        layer === "risk"      && "layer-risk",
        hover && "card-hover cursor-pointer",
        className
      )}
      {...props}
    />
  );
}