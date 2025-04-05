import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "@/components/ui/clock";
import { Countdown } from "@/components/ui/countdown";
import PrayerCard from "@/components/prayer-card";
import LocationSelector from "@/components/location-selector";
import NotificationToggle from "@/components/notification-toggle";
import { useLocation } from "@/lib/useLocation";
import { calculatePrayerTimes, PrayerTimesData } from "@/lib/prayerTimes";
import { Separator } from "@/components/ui/separator";

export default function PrayerTimes() {
  const { location, updateLocation } = useLocation();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [date, setDate] = useState(new Date());

  // Update prayer times when location changes or at midnight
  useEffect(() => {
    if (location.latitude && location.longitude) {
      const times = calculatePrayerTimes(
        location.latitude,
        location.longitude,
        date,
      );
      setPrayerTimes(times);

      // Set up notification if enabled
      setupNotifications(times);
    }
  }, [location.latitude, location.longitude, date]);

  // Update the date at midnight to recalculate prayer times for the new day
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    const midnightTimer = setTimeout(() => {
      setDate(new Date());
    }, timeUntilMidnight);

    return () => clearTimeout(midnightTimer);
  }, [date]);

  // Update prayer times every minute to keep current/next prayer status updated
  useEffect(() => {
    const minuteTimer = setInterval(() => {
      if (location.latitude && location.longitude) {
        const times = calculatePrayerTimes(
          location.latitude,
          location.longitude,
          date,
        );
        setPrayerTimes(times);
      }
    }, 60000); // Update every minute

    return () => clearInterval(minuteTimer);
  }, [location.latitude, location.longitude, date]);

  // Setup notifications for prayer times
  const setupNotifications = (times: PrayerTimesData) => {
    if (!times.nextPrayerTime || !window.Notification) return;

    // Check if notifications are enabled
    const notificationsEnabled =
      localStorage.getItem("prayerNotifications") === "true";
    if (!notificationsEnabled || Notification.permission !== "granted") return;

    // Calculate time 15 minutes before prayer
    const notificationTime = new Date(times.nextPrayerTime);
    notificationTime.setMinutes(notificationTime.getMinutes() - 15);

    const now = new Date();
    let timeUntilNotification = notificationTime.getTime() - now.getTime();

    // Only set notification if it's in the future and less than 24 hours away
    if (
      timeUntilNotification > 0 &&
      timeUntilNotification < 24 * 60 * 60 * 1000
    ) {
      setTimeout(() => {
        new Notification(`${times.nextPrayer} Prayer Soon`, {
          body: `${times.nextPrayer} prayer will begin in 15 minutes.`,
          icon: "/vite.svg",
        });
      }, timeUntilNotification);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Islamic Prayer Times
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <LocationSelector
              location={location}
              onUpdateLocation={updateLocation}
            />
            <NotificationToggle />
          </div>
        </div>

        <Card className="w-full mb-8 bg-card shadow-md border-border overflow-hidden">
          <CardContent className="p-6 flex flex-col items-center">
            <div className="flex flex-col items-center mb-4 w-full">
              <div className="flex justify-center gap-4 mb-2">
                <button
                  onClick={() =>
                    document.documentElement.style.setProperty(
                      "--clock-scale",
                      "0.8",
                    )
                  }
                  className="px-2 py-1 text-xs bg-secondary rounded-md hover:bg-secondary/80"
                >
                  Small
                </button>
                <button
                  onClick={() =>
                    document.documentElement.style.setProperty(
                      "--clock-scale",
                      "1",
                    )
                  }
                  className="px-2 py-1 text-xs bg-secondary rounded-md hover:bg-secondary/80"
                >
                  Medium
                </button>
                <button
                  onClick={() =>
                    document.documentElement.style.setProperty(
                      "--clock-scale",
                      "1.2",
                    )
                  }
                  className="px-2 py-1 text-xs bg-secondary rounded-md hover:bg-secondary/80"
                >
                  Large
                </button>
              </div>
              <Clock
                className="transform scale-[var(--clock-scale,1)] transition-transform duration-300"
                size="large"
                showHijriDate={true}
              />
            </div>

            {prayerTimes && prayerTimes.nextPrayerTime && (
              <Countdown
                targetTime={prayerTimes.nextPrayerTime}
                label={`Time remaining until ${prayerTimes.nextPrayer}`}
                className="mt-2"
              />
            )}
          </CardContent>
        </Card>

        {location.error ? (
          <Card className="w-full p-6 text-center">
            <p className="text-destructive mb-2">Location Error</p>
            <p className="text-muted-foreground">{location.error}</p>
            <p className="mt-4">
              Please set your location manually to see prayer times.
            </p>
          </Card>
        ) : location.loading ? (
          <Card className="w-full p-6 text-center">
            <p>Loading prayer times...</p>
          </Card>
        ) : prayerTimes ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PrayerCard prayer={prayerTimes.fajr} />
            <PrayerCard prayer={prayerTimes.sunrise} />
            <PrayerCard prayer={prayerTimes.dhuhr} />
            <PrayerCard prayer={prayerTimes.asr} />
            <PrayerCard prayer={prayerTimes.maghrib} />
            <PrayerCard prayer={prayerTimes.isha} />
          </div>
        ) : null}

        <Separator className="my-8" />

        <footer className="text-center text-sm text-muted-foreground">
          <p>Islamic Prayer Times Application</p>
          <p className="mt-1">
            Using Adhan.js for accurate prayer time calculations
          </p>
        </footer>
      </div>
    </div>
  );
}
