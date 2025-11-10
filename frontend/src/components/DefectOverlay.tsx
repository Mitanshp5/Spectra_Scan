import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Defect {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  severity: "low" | "medium" | "high";
}

interface DefectOverlayProps {
  imageUrl: string;
  defects: Defect[];
  className?: string;
}

const severityColors = {
  low: "border-success",
  medium: "border-warning",
  high: "border-destructive",
};

export const DefectOverlay = ({ imageUrl, defects, className }: DefectOverlayProps) => {
  const [zoom, setZoom] = useState(1);
  const [selectedDefect, setSelectedDefect] = useState<string | null>(null);

  return (
    <Card className={className}>
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-mono text-sm font-bold uppercase tracking-wider">Defect Visualization</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setZoom(Math.min(2, zoom + 0.25))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => setZoom(1)}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-4 bg-secondary/50 overflow-auto">
        <div
          className="relative mx-auto"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center",
            transition: "transform 0.3s ease",
          }}
        >
          <img
            src={imageUrl}
            alt="Scanned door"
            className="w-full h-auto rounded-md border border-border"
          />
          {defects.map((defect) => (
            <div
              key={defect.id}
              className={`absolute border-2 ${severityColors[defect.severity]} cursor-pointer transition-all duration-200 ${
                selectedDefect === defect.id ? "border-4 border-glow" : ""
              }`}
              style={{
                left: `${defect.x}%`,
                top: `${defect.y}%`,
                width: `${defect.width}%`,
                height: `${defect.height}%`,
              }}
              onClick={() => setSelectedDefect(defect.id)}
              onMouseEnter={() => setSelectedDefect(defect.id)}
              onMouseLeave={() => setSelectedDefect(null)}
            >
              {selectedDefect === defect.id && (
                <div className="absolute -top-16 left-0 bg-card border border-border rounded-md p-2 shadow-lg z-10 whitespace-nowrap">
                  <div className="text-xs font-mono">
                    <div className="font-bold text-primary">{defect.type}</div>
                    <div className="text-muted-foreground">ID: {defect.id}</div>
                    <div className="text-muted-foreground">
                      Confidence: {(defect.confidence * 100).toFixed(1)}%
                    </div>
                    <div className={`font-bold ${severityColors[defect.severity]}`}>
                      {defect.severity.toUpperCase()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
