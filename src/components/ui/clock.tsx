import { useState, useEffect } from "react";

interface ClockProps {
  className?: string;
}

export function Clock({ className = "" }: ClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="text-6xl font-bold font-mono tracking-wider text-primary">
        {hours}:{minutes}:{seconds}
      </div>
      <div className="text-lg text-muted-foreground mt-2">
        {time.toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    </div>
  );
}
