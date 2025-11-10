import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { LogViewer, LogEntry } from "@/components/LogViewer";
import { ScanAnimation } from "@/components/ScanAnimation";
import { ImageGrid } from "@/components/ImageGrid";
import { ScanProgress } from "@/components/ScanProgress";
import { Play, Square, Settings, Database, Activity } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"idle" | "scanning" | "processing" | "complete">("idle");
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      timestamp: new Date().toLocaleTimeString(),
      message: "System initialized successfully",
      type: "success",
    },
    {
      timestamp: new Date().toLocaleTimeString(),
      message: "Camera calibration complete",
      type: "info",
    },
    {
      timestamp: new Date().toLocaleTimeString(),
      message: "YOLO model loaded",
      type: "success",
    },
  ]);
  const [images, setImages] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [scanStage, setScanStage] = useState("Ready");

  const addLog = (message: string, type: LogEntry["type"] = "info") => {
    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString(),
        message,
        type,
      },
    ]);
  };

  const startScan = async () => {
    setStatus("scanning");
    setProgress(0);
    setScanStage("Initializing scan...");
    addLog("Starting scan sequence", "info");
    toast.success("Scan initiated");

    // Simulate scanning process
    const scanInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          clearInterval(scanInterval);
          setStatus("processing");
          setScanStage("Processing images...");
          addLog("Scan complete, processing data", "success");
          
          // Simulate processing
          setTimeout(() => {
            setStatus("complete");
            setScanStage("Analysis complete");
            addLog("Defect detection complete", "success");
            addLog(`Found ${Math.floor(Math.random() * 10 + 5)} potential defects`, "warning");
            toast.success("Scan analysis complete!");
            
            // Navigate to results after a short delay
            setTimeout(() => {
              navigate("/results");
            }, 2000);
          }, 3000);
          
          return 100;
        }

        // Add images during scan
        if (newProgress % 10 === 0) {
          const imageId = `IMG_${String(Math.floor(newProgress / 10)).padStart(3, "0")}`;
          setImages((prev) => [
            ...prev,
            {
              id: imageId,
              url: `https://picsum.photos/seed/${imageId}/400/300`,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
          addLog(`Captured image ${imageId}`, "info");
        }

        if (newProgress < 30) setScanStage("Scanning upper section...");
        else if (newProgress < 60) setScanStage("Scanning middle section...");
        else if (newProgress < 90) setScanStage("Scanning lower section...");
        else setScanStage("Finalizing scan...");

        return newProgress;
      });
    }, 100);
  };

  const stopScan = () => {
    setStatus("idle");
    setProgress(0);
    setScanStage("Ready");
    addLog("Scan stopped by user", "warning");
    toast.info("Scan stopped");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-glow mb-2">
              SpectraScan
            </h1>
            <p className="text-muted-foreground font-mono">Automated Paint Defect Scanner v1.0</p>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={status} />
            <Button variant="outline" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Control Panel */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2 font-mono uppercase tracking-wider">
                Control Panel
              </h2>
              <p className="text-sm text-muted-foreground font-mono">
                Initialize and control scanning operations
              </p>
            </div>
            <div className="flex gap-3">
              {status === "idle" || status === "complete" ? (
                <Button variant="scanner" size="xl" onClick={startScan}>
                  <Play className="h-5 w-5 mr-2" />
                  Start Scan
                </Button>
              ) : (
                <Button variant="destructive" size="xl" onClick={stopScan}>
                  <Square className="h-5 w-5 mr-2" />
                  Stop Scan
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Database className="h-5 w-5 text-primary" />
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Total Scans
              </h3>
            </div>
            <p className="text-3xl font-bold font-mono text-primary">1,247</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-5 w-5 text-success" />
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Defects Detected
              </h3>
            </div>
            <p className="text-3xl font-bold font-mono text-success">8,432</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-5 w-5 text-warning" />
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Accuracy Rate
              </h3>
            </div>
            <p className="text-3xl font-bold font-mono text-warning">97.8%</p>
          </Card>
        </div>

        {/* Progress */}
        {(status === "scanning" || status === "processing") && (
          <ScanProgress progress={progress} stage={scanStage} />
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScanAnimation isScanning={status === "scanning"} />
          <LogViewer logs={logs} />
        </div>

        {/* Image Grid */}
        {images.length > 0 && (
          <ImageGrid images={images} loading={status === "scanning"} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
