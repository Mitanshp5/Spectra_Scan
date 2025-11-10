import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Defect } from "./DefectOverlay";

interface DefectTableProps {
  defects: Defect[];
  className?: string;
}

const severityBadgeVariant = {
  low: "default",
  medium: "secondary",
  high: "destructive",
} as const;

export const DefectTable = ({ defects, className }: DefectTableProps) => {
  const [sortBy, setSortBy] = useState<"severity" | "confidence" | "type">("severity");

  const sortedDefects = [...defects].sort((a, b) => {
    if (sortBy === "severity") {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    }
    if (sortBy === "confidence") {
      return b.confidence - a.confidence;
    }
    return a.type.localeCompare(b.type);
  });

  const handleExportCSV = () => {
    const headers = ["ID", "Type", "Severity", "Confidence", "Location (x,y)", "Size (w,h)"];
    const rows = defects.map((d) => [
      d.id,
      d.type,
      d.severity,
      `${(d.confidence * 100).toFixed(1)}%`,
      `${d.x.toFixed(1)}%, ${d.y.toFixed(1)}%`,
      `${d.width.toFixed(1)}%, ${d.height.toFixed(1)}%`,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `defect-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <Card className={className}>
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-mono text-sm font-bold uppercase tracking-wider">
          Defect Summary ({defects.length})
        </h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button size="sm" variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-mono">ID</TableHead>
              <TableHead
                className="font-mono cursor-pointer hover:text-primary"
                onClick={() => setSortBy("type")}
              >
                Type {sortBy === "type" && "↓"}
              </TableHead>
              <TableHead
                className="font-mono cursor-pointer hover:text-primary"
                onClick={() => setSortBy("severity")}
              >
                Severity {sortBy === "severity" && "↓"}
              </TableHead>
              <TableHead
                className="font-mono cursor-pointer hover:text-primary"
                onClick={() => setSortBy("confidence")}
              >
                Confidence {sortBy === "confidence" && "↓"}
              </TableHead>
              <TableHead className="font-mono">Location</TableHead>
              <TableHead className="font-mono">Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDefects.map((defect) => (
              <TableRow key={defect.id} className="hover:bg-primary/5">
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {defect.id}
                </TableCell>
                <TableCell className="font-mono text-sm font-medium">{defect.type}</TableCell>
                <TableCell>
                  <Badge variant={severityBadgeVariant[defect.severity]}>
                    {defect.severity.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {(defect.confidence * 100).toFixed(1)}%
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  ({defect.x.toFixed(1)}, {defect.y.toFixed(1)})
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {defect.width.toFixed(1)} × {defect.height.toFixed(1)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
