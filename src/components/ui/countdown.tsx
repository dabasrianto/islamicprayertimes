import { useState, useEffect } from "react";

interface CountdownProps {
  targetTime: Date | null;
  label: string;
  className?: string;
}

export function Countdown({
  targetTime,
  label,
  className = "",
}: CountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState("00:00:00");

  useEffect(() => {
    if (!targetTime) return;

    const calculateRemaining = () => {
      const now = new Date();
      let diff = targetTime.getTime() - now.getTime();

      // If the target time is tomorrow (for Fajr)
      if (diff < 0) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowTarget = new Date(targetTime);
        tomorrowTarget.setDate(tomorrowTarget.getDate() + 1);
        diff = tomorrowTarget.getTime() - now.getTime();
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    setTimeRemaining(calculateRemaining());

    const timer = setInterval(() => {
      setTimeRemaining(calculateRemaining());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [targetTime]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className="text-3xl font-mono font-semibold text-primary">
        {timeRemaining}
      </div>
    </div>
  );
}
