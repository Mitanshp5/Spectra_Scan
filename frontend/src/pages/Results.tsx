import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DefectOverlay, Defect } from "@/components/DefectOverlay";
import { DefectTable } from "@/components/DefectTable";
import { ArrowLeft, RotateCcw, Download } from "lucide-react";
import { toast } from "sonner";

const Results = () => {
  const navigate = useNavigate();
  const { scan_id } = useParams();
  const [defects, setDefects] = useState<Defect[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [scanDate, setScanDate] = useState(new Date());

  useEffect(() => {
    const fetchResults = async () => {
      if (!scan_id) {
        toast.error("No scan ID provided.");
        navigate("/");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/scan/results/${scan_id}`);
        const data = await response.json();

        if (data.status === "complete") {
          setDefects(data.defects || []);
          setSummary(data.summary || {});
          setScanDate(data.scan_date ? new Date(data.scan_date * 1000) : new Date());
          toast.success("Scan results loaded.");
        } else {
          toast.warning("Scan is not complete or results are not available yet.");
        }
      } catch (error) {
        console.error("Failed to fetch results:", error);
        toast.error("Failed to fetch scan results.");
        navigate("/");
      }
    };

    fetchResults();
  }, [scan_id, navigate]);

  const handleNewScan = () => {
    toast.success("Redirecting to dashboard");
    navigate("/");
  };

  const handleDownloadReport = () => {
    if (scan_id) {
      window.open(`http://localhost:8000/api/scan/report/${scan_id}`, "_blank");
      toast.success("Report opened in a new tab.");
    } else {
      toast.error("Scan ID is not available to generate a report.");
    }
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
                Scan completed: {scanDate.toLocaleString()}
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
          imageUrl="/door.jpg"
          defects={defects}
        />

        {/* Defect Table */}
        <DefectTable defects={defects} />

        {/* Analysis Summary */}
        <Card className="p-6">
          <h3 className="font-mono text-lg font-bold uppercase tracking-wider mb-4">
            Analysis Summary
          </h3>
          {summary ? (
            <div className="space-y-2 text-sm font-mono">
              <p className="text-muted-foreground">
                • Scan completed in {summary.scan_duration}
              </p>
              <p className="text-muted-foreground">
                • Processed {summary.image_tiles} image tiles
              </p>
              <p className="text-muted-foreground">
                • Average confidence score: {summary.avg_confidence}
              </p>
              <p className="text-muted-foreground">
                • YOLO model: {summary.model_name}
              </p>
              <p className={summary.quality_status === "REQUIRES REVIEW" ? "text-destructive font-bold" : "text-success font-bold"}>
                • Quality Status: {summary.quality_status}
              </p>
            </div>
          ) : (
            <p>Loading summary...</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Results;
