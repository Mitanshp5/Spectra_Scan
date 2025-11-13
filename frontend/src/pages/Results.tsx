import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DefectOverlay, Defect } from "@/components/DefectOverlay";
import { DefectTable } from "@/components/DefectTable";
import { ArrowLeft, RotateCcw, Download } from "lucide-react";
import { toast } from "sonner";

// Mock defect data
const mockDefects: Defect[] = [
  { id: "DEF001", type: "Scratch", x: 25, y: 15, width: 8, height: 3, confidence: 0.95, severity: "high" },
  { id: "DEF002", type: "Paint Bubble", x: 45, y: 30, width: 5, height: 5, confidence: 0.89, severity: "medium" },
  { id: "DEF003", type: "Dust Particle", x: 60, y: 20, width: 3, height: 2, confidence: 0.76, severity: "low" },
  { id: "DEF004", type: "Orange Peel", x: 70, y: 50, width: 12, height: 8, confidence: 0.92, severity: "medium" },
  { id: "DEF005", type: "Color Mismatch", x: 30, y: 60, width: 15, height: 10, confidence: 0.88, severity: "high" },
  { id: "DEF006", type: "Scratch", x: 80, y: 70, width: 6, height: 2, confidence: 0.94, severity: "high" },
  { id: "DEF007", type: "Dust Particle", x: 15, y: 80, width: 2, height: 2, confidence: 0.72, severity: "low" },
];

const Results = () => {
  const navigate = useNavigate();
  const [defects] = useState<Defect[]>(mockDefects);

  const handleNewScan = () => {
    toast.success("Redirecting to dashboard");
    navigate("/");
  };

  const handleDownloadReport = () => {
    toast.success("Generating PDF report...");
    // Mock PDF generation
    setTimeout(() => {
      toast.success("Report downloaded successfully");
    }, 1500);
  };

  const criticalDefects = defects.filter((d) => d.severity === "high").length;
  const mediumDefects = defects.filter((d) => d.severity === "medium").length;
  const lowDefects = defects.filter((d) => d.severity === "low").length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-glow mb-2">Scan Results</h1>
              <p className="text-muted-foreground font-mono">
                Scan completed: {new Date().toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="lg" onClick={handleDownloadReport}>
              <Download className="h-5 w-5 mr-2" />
              Download Report
            </Button>
            <Button variant="scanner" size="lg" onClick={handleNewScan}>
              <RotateCcw className="h-5 w-5 mr-2" />
              New Scan
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 border-2 border-primary border-glow">
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Total Defects
            </h3>
            <p className="text-4xl font-bold font-mono text-primary">{defects.length}</p>
          </Card>
          <Card className="p-6 border-2 border-destructive/50">
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Critical
            </h3>
            <p className="text-4xl font-bold font-mono text-destructive">{criticalDefects}</p>
          </Card>
          <Card className="p-6 border-2 border-warning/50">
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Medium
            </h3>
            <p className="text-4xl font-bold font-mono text-warning">{mediumDefects}</p>
          </Card>
          <Card className="p-6 border-2 border-success/50">
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Low Priority
            </h3>
            <p className="text-4xl font-bold font-mono text-success">{lowDefects}</p>
          </Card>
        </div>

        {/* Defect Visualization */}
        <DefectOverlay
          imageUrl="https://www.partfinder.me/assets/theme/pf-main/images/banner/parts/car-door.png"
          defects={defects}
        />

        {/* Defect Table */}
        <DefectTable defects={defects} />

        {/* Analysis Summary */}
        <Card className="p-6">
          <h3 className="font-mono text-lg font-bold uppercase tracking-wider mb-4">
            Analysis Summary
          </h3>
          <div className="space-y-2 text-sm font-mono">
            <p className="text-muted-foreground">
              • Scan completed in 3 minutes 42 seconds
            </p>
            <p className="text-muted-foreground">
              • Processed 127 image tiles
            </p>
            <p className="text-muted-foreground">
              • Average confidence score: 87.3%
            </p>
            <p className="text-muted-foreground">
              • YOLO model: YOLOv8-nano (defect detection)
            </p>
            <p className={criticalDefects > 0 ? "text-destructive font-bold" : "text-success font-bold"}>
              • Quality Status: {criticalDefects > 0 ? "REQUIRES REVIEW" : "PASSED"}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Results;
