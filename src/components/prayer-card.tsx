import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PrayerTime, formatTime } from "@/lib/prayerTimes";
import { Clock, Sunrise, Sun, Sunset, Moon } from "lucide-react";

interface PrayerCardProps {
  prayer: PrayerTime;
  className?: string;
}

export default function PrayerCard({ prayer, className }: PrayerCardProps) {
  const getIcon = () => {
    switch (prayer.name.toLowerCase()) {
      case "fajr":
        return <Moon className="h-5 w-5" />;
      case "sunrise":
        return <Sunrise className="h-5 w-5" />;
      case "dhuhr":
        return <Sun className="h-5 w-5" />;
      case "asr":
        return <Sun className="h-5 w-5" />;
      case "maghrib":
        return <Sunset className="h-5 w-5" />;
      case "isha":
        return <Moon className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300",
        prayer.isNext
          ? "border-primary bg-primary/5"
          : prayer.isCurrent
            ? "border-primary/70 bg-primary/10"
            : "border-border",
        className,
      )}
    >
      <CardContent className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-2 rounded-full",
              prayer.isNext
                ? "bg-primary text-primary-foreground"
                : prayer.isCurrent
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground",
            )}
          >
            {getIcon()}
          </div>
          <div>
            <h3
              className={cn(
                "font-medium",
                prayer.isNext || prayer.isCurrent
                  ? "text-primary"
                  : "text-foreground",
              )}
            >
              {prayer.name}
            </h3>
            {(prayer.isNext || prayer.isCurrent) && (
              <p className="text-xs text-muted-foreground">
                {prayer.isNext ? "Next Prayer" : "Current Prayer"}
              </p>
            )}
          </div>
        </div>
        <div
          className={cn(
            "text-xl font-mono",
            prayer.isNext
              ? "text-primary font-bold"
              : prayer.isCurrent
                ? "text-primary"
                : "text-foreground",
          )}
        >
          {formatTime(prayer.time)}
        </div>
      </CardContent>
    </Card>
  );
}
