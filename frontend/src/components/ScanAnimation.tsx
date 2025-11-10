import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Camera } from "lucide-react";

interface ScanAnimationProps {
  isScanning: boolean;
  className?: string;
}

export const ScanAnimation = ({ isScanning, className }: ScanAnimationProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState<"right" | "left">("right");

  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      setPosition((prev) => {
        let newX = prev.x;
        let newY = prev.y;
        let newDirection = direction;

        // Move horizontally
        if (direction === "right") {
          newX = prev.x + 2;
          if (newX >= 90) {
            newX = 90;
            newY = prev.y + 10;
            newDirection = "left";
          }
        } else {
          newX = prev.x - 2;
          if (newX <= 0) {
            newX = 0;
            newY = prev.y + 10;
            newDirection = "right";
          }
        }

        // Reset when reaching bottom
        if (newY >= 90) {
          newY = 0;
          newX = 0;
          newDirection = "right";
        }

        setDirection(newDirection);
        return { x: newX, y: newY };
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isScanning, direction]);

  return (
    <Card className={className}>
      <div className="p-4 border-b border-border">
        <h3 className="font-mono text-sm font-bold uppercase tracking-wider">
          Camera Path Visualization
        </h3>
      </div>
      <div className="p-8">
        <div className="relative aspect-[3/4] bg-secondary/30 rounded-lg border-2 border-dashed border-primary/30 overflow-hidden">
          {/* Grid overlay */}
          <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="border border-border/20" />
            ))}
          </div>

          {/* Scan line */}
          {isScanning && (
            <div
              className="absolute left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_rgba(0,229,255,0.8)]"
              style={{ top: `${position.y}%` }}
            />
          )}

          {/* Camera icon */}
          {isScanning && (
            <div
              className="absolute transition-all duration-100 ease-linear"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="relative">
                <Camera className="h-8 w-8 text-primary drop-shadow-[0_0_10px_rgba(0,229,255,0.8)]" />
                <div className="absolute -inset-2 border-2 border-primary rounded-full animate-pulse-glow" />
              </div>
            </div>
          )}

          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Camera className="h-16 w-16 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground font-mono">Awaiting scan start</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
