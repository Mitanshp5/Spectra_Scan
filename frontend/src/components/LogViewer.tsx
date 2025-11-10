import { useEffect, useRef } from "react";
import { Terminal } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

export interface LogEntry {
  timestamp: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

interface LogViewerProps {
  logs: LogEntry[];
  className?: string;
}

const typeStyles = {
  info: "text-foreground",
  success: "text-success",
  warning: "text-warning",
  error: "text-destructive",
};

export const LogViewer = ({ logs, className }: LogViewerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Card className={className}>
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <Terminal className="h-5 w-5 text-primary" />
        <h3 className="font-mono text-sm font-bold uppercase tracking-wider">System Logs</h3>
      </div>
      <ScrollArea className="h-[300px]">
        <div ref={scrollRef} className="p-4 space-y-2 font-mono text-xs">
          {logs.length === 0 ? (
            <div className="text-muted-foreground">No logs to display</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="flex gap-3 animate-fade-in">
                <span className="text-muted-foreground shrink-0">[{log.timestamp}]</span>
                <span className={typeStyles[log.type]}>{log.message}</span>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
