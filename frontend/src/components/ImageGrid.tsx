import { Card } from "@/components/ui/card";
import { Image as ImageIcon, Loader2 } from "lucide-react";

interface ImageData {
  id: string;
  url: string;
  timestamp: string;
}

interface ImageGridProps {
  images: ImageData[];
  loading?: boolean;
  className?: string;
}

export const ImageGrid = ({ images, loading = false, className }: ImageGridProps) => {
  return (
    <Card className={className}>
      <div className="p-4 border-b border-border">
        <h3 className="font-mono text-sm font-bold uppercase tracking-wider flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-primary" />
          Captured Images ({images.length})
        </h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative aspect-square bg-secondary rounded-md overflow-hidden border border-border hover:border-primary transition-all duration-300 group"
            >
              <img
                src={image.url}
                alt={`Scan ${image.id}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-xs font-mono text-muted-foreground">{image.timestamp}</p>
                  <p className="text-xs font-mono text-foreground">ID: {image.id}</p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="aspect-square bg-secondary/50 rounded-md border-2 border-dashed border-primary/30 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
        </div>
        {images.length === 0 && !loading && (
          <div className="text-center text-muted-foreground py-12 font-mono text-sm">
            No images captured yet
          </div>
        )}
      </div>
    </Card>
  );
};
