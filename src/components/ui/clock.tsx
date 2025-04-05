import { useState, useEffect } from "react";

type ClockSize = "small" | "medium" | "large";

interface ClockProps {
  className?: string;
  size?: ClockSize;
  showHijriDate?: boolean;
}

const clockSizes = {
  small: {
    time: "text-4xl",
    date: "text-sm",
  },
  medium: {
    time: "text-6xl",
    date: "text-lg",
  },
  large: {
    time: "text-7xl",
    date: "text-xl",
  },
};

export function Clock({
  className = "",
  size = "medium",
  showHijriDate = false,
}: ClockProps) {
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

  // Calculate Hijri date manually
  const getHijriDate = () => {
    try {
      // Manual calculation of Hijri date (approximate)
      const gregorianDate = new Date(time);

      // Julian day calculation
      const day = gregorianDate.getDate();
      const month = gregorianDate.getMonth() + 1;
      const year = gregorianDate.getFullYear();

      let jd =
        Math.floor((1461 * (year + 4800 + Math.floor((month - 14) / 12))) / 4) +
        Math.floor(
          (367 * (month - 2 - 12 * Math.floor((month - 14) / 12))) / 12,
        ) -
        Math.floor(
          (3 *
            Math.floor((year + 4900 + Math.floor((month - 14) / 12)) / 100)) /
            4,
        ) +
        day -
        32075;

      // Hijri date calculation
      jd = jd - 1948440 + 10632;
      const n = Math.floor((jd - 1) / 10631);
      jd = jd - 10631 * n + 354;

      const j =
        Math.floor((10985 - jd) / 5316) * Math.floor((50 * jd) / 17719) +
        Math.floor(jd / 5670) * Math.floor((43 * jd) / 15238);

      jd =
        jd -
        Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
        Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
        29;

      const hijriMonth = Math.floor((24 * jd) / 709);
      const hijriDay = jd - Math.floor((709 * hijriMonth) / 24);
      const hijriYear = 30 * n + j - 30;

      // Hijri month names
      const hijriMonthNames = [
        "Muharram",
        "Safar",
        "Rabi' al-Awwal",
        "Rabi' al-Thani",
        "Jumada al-Awwal",
        "Jumada al-Thani",
        "Rajab",
        "Sha'ban",
        "Ramadan",
        "Shawwal",
        "Dhu al-Qi'dah",
        "Dhu al-Hijjah",
      ];

      return `${hijriDay} ${hijriMonthNames[hijriMonth - 1]} ${hijriYear} AH`;
    } catch (error) {
      console.error("Error calculating Hijri date:", error);
      return "Calculating...";
    }
  };

  const sizeClasses = clockSizes[size];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className={`${sizeClasses.time} font-bold font-mono tracking-wider text-primary`}
      >
        {hours}:{minutes}:{seconds}
      </div>
      <div className="flex flex-col md:flex-row md:gap-4 items-center mt-2 text-center">
        <div
          className={`${sizeClasses.date} text-muted-foreground font-medium`}
        >
          {time.toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        {showHijriDate && (
          <>
            <div className="hidden md:block h-4 w-px bg-muted mx-2"></div>
            <div
              className={`${sizeClasses.date} text-muted-foreground font-medium italic`}
            >
              {getHijriDate()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
