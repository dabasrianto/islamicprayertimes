import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Paintbrush } from "lucide-react";

interface BackgroundSelectorProps {
  onSelectBackground: (background: string) => void;
}

const presetBackgrounds = [
  {
    name: "Mosque",
    url: "https://images.unsplash.com/photo-1564769625688-8654b7f50628?w=1200&q=80",
  },
  {
    name: "Islamic Pattern 1",
    url: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=1200&q=80",
  },
  {
    name: "Islamic Pattern 2",
    url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80",
  },
  {
    name: "Blue Mosque",
    url: "https://images.unsplash.com/photo-1545167496-c1e092d383a2?w=1200&q=80",
  },
  {
    name: "Geometric Pattern",
    url: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=1200&q=80",
  },
  {
    name: "Minimalist",
    url: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=1200&q=80",
  },
];

const patternBackgrounds = [
  {
    name: "Islamic Pattern Green",
    color: "bg-emerald-50",
    pattern: "bg-[url('/patterns/pattern1.svg')]",
  },
  {
    name: "Islamic Pattern Blue",
    color: "bg-blue-50",
    pattern: "bg-[url('/patterns/pattern2.svg')]",
  },
  {
    name: "Islamic Pattern Gold",
    color: "bg-amber-50",
    pattern: "bg-[url('/patterns/pattern3.svg')]",
  },
  {
    name: "Solid Light",
    color: "bg-background",
    pattern: "",
  },
  {
    name: "Solid Dark",
    color: "bg-slate-900",
    pattern: "",
  },
];

export default function BackgroundSelector({
  onSelectBackground,
}: BackgroundSelectorProps) {
  const [open, setOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (url: string) => {
    console.log("Selected preset:", url);
    // Force a new selection by adding a timestamp
    onSelectBackground(`${url}#${Date.now()}`);
    setOpen(false);
  };

  const handleSelectPattern = (color: string, pattern: string) => {
    console.log("Selected pattern:", color, pattern);
    // Force a new selection by adding a timestamp
    onSelectBackground(`${color}|${pattern}#${Date.now()}`);
    setOpen(false);
  };

  const handleSelectUploaded = () => {
    if (uploadedImage) {
      console.log("Selected uploaded image");
      // Force a new selection by adding a timestamp
      onSelectBackground(`${uploadedImage}#${Date.now()}`);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Paintbrush className="h-4 w-4" />
          Change Background
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Choose Background</DialogTitle>
          <DialogDescription>
            Select a preset background, upload your own, or choose a pattern.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {presetBackgrounds.map((bg) => (
                <div
                  key={bg.name}
                  className="relative overflow-hidden rounded-md cursor-pointer border border-border hover:border-primary transition-all"
                  onClick={() => handleSelectPreset(bg.url)}
                >
                  <div
                    className="w-full h-32 bg-cover bg-center"
                    style={{ backgroundImage: `url(${bg.url})` }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-xs">
                    {bg.name}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {patternBackgrounds.map((bg) => (
                <div
                  key={bg.name}
                  className="relative overflow-hidden rounded-md cursor-pointer border border-border hover:border-primary transition-all"
                  onClick={() => handleSelectPattern(bg.color, bg.pattern)}
                >
                  <div
                    className={`w-full h-32 bg-cover bg-center ${bg.color} ${bg.pattern}`}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-xs">
                    {bg.name}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="mt-4">
            <div className="flex flex-col items-center gap-4">
              <div className="w-full p-8 border-2 border-dashed border-muted-foreground/50 rounded-lg text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="background-upload"
                />
                <label
                  htmlFor="background-upload"
                  className="cursor-pointer text-primary hover:text-primary/80"
                >
                  Click to upload an image
                </label>
                {uploadedImage && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Preview:
                    </p>
                    <div
                      className="w-full h-40 bg-cover bg-center rounded-md mx-auto"
                      style={{ backgroundImage: `url(${uploadedImage})` }}
                    />
                  </div>
                )}
              </div>
              <Button
                onClick={handleSelectUploaded}
                disabled={!uploadedImage}
                className="w-full"
              >
                Use Uploaded Image
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
