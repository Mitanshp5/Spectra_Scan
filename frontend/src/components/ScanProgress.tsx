import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity } from "lucide-react";

interface ScanProgressProps {
  progress: number;
  stage: string;
  className?: string;
}

export const ScanProgress = ({ progress, stage, className }: ScanProgressProps) => {
  return (
    <Card className={className}>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-primary animate-pulse" />
            <div>
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider">Scan Progress</h3>
              <p className="text-xs text-muted-foreground font-mono mt-1">{stage}</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-primary font-mono">
            {Math.round(progress)}%
          </div>
        </div>
        <Progress value={progress} className="h-3" />
      </div>
    </Card>
  );
};
