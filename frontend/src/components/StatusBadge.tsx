import { cn } from "@/lib/utils";

type Status = "idle" | "scanning" | "processing" | "complete" | "error";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; className: string; dotClass: string }> = {
  idle: {
    label: "Idle",
    className: "bg-muted text-muted-foreground border-muted-foreground/30",
    dotClass: "bg-muted-foreground",
  },
  scanning: {
    label: "Scanning",
    className: "bg-primary/20 text-primary border-primary border-glow",
    dotClass: "bg-primary animate-pulse",
  },
  processing: {
    label: "Processing",
    className: "bg-warning/20 text-warning border-warning border-glow-warning",
    dotClass: "bg-warning animate-pulse",
  },
  complete: {
    label: "Complete",
    className: "bg-success/20 text-success border-success border-glow-success",
    dotClass: "bg-success",
  },
  error: {
    label: "Error",
    className: "bg-destructive/20 text-destructive border-destructive border-glow-error",
    dotClass: "bg-destructive animate-pulse",
  },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-md border-2 font-mono text-sm font-bold uppercase tracking-wider transition-all duration-300",
        config.className,
        className
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", config.dotClass)} />
      {config.label}
    </div>
  );
};
