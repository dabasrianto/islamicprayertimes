import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, Navigation } from "lucide-react";
import { LocationData } from "@/lib/useLocation";

interface LocationSelectorProps {
  location: LocationData;
  onUpdateLocation: (latitude: number, longitude: number) => Promise<void>;
}

export default function LocationSelector({
  location,
  onUpdateLocation,
}: LocationSelectorProps) {
  const [open, setOpen] = useState(false);
  const [manualLatitude, setManualLatitude] = useState(
    location.latitude.toString(),
  );
  const [manualLongitude, setManualLongitude] = useState(
    location.longitude.toString(),
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleAutoDetect = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await onUpdateLocation(latitude, longitude);
          setIsLoading(false);
          setOpen(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
        },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    setIsLoading(true);
    try {
      const lat = parseFloat(manualLatitude);
      const lng = parseFloat(manualLongitude);

      if (isNaN(lat) || isNaN(lng)) {
        throw new Error("Invalid coordinates");
      }

      await onUpdateLocation(lat, lng);
      setOpen(false);
    } catch (error) {
      console.error("Error updating location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {location.loading
            ? "Loading location..."
            : location.error
              ? "Set location"
              : `${location.city}, ${location.country}`}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Location</DialogTitle>
          <DialogDescription>
            Set your location to get accurate prayer times for your area.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            onClick={handleAutoDetect}
            className="w-full flex items-center gap-2"
            disabled={isLoading}
          >
            <Navigation className="h-4 w-4" />
            Auto-detect my location
          </Button>

          <div className="text-center text-sm text-muted-foreground my-2">
            OR
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                value={manualLatitude}
                onChange={(e) => setManualLatitude(e.target.value)}
                placeholder="e.g. 21.4225"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                value={manualLongitude}
                onChange={(e) => setManualLongitude(e.target.value)}
                placeholder="e.g. 39.8262"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleManualSubmit} disabled={isLoading}>
            Save location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
