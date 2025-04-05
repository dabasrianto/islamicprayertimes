import {
  Coordinates,
  CalculationMethod,
  PrayerTimes,
  SunnahTimes,
} from "adhan";

export interface PrayerTime {
  name: string;
  time: Date;
  isNext: boolean;
  isCurrent: boolean;
}

export interface PrayerTimesData {
  fajr: PrayerTime;
  sunrise: PrayerTime;
  dhuhr: PrayerTime;
  asr: PrayerTime;
  maghrib: PrayerTime;
  isha: PrayerTime;
  nextPrayer: string;
  currentPrayer: string | null;
  nextPrayerTime: Date | null;
}

export function calculatePrayerTimes(
  latitude: number,
  longitude: number,
  date: Date = new Date(),
): PrayerTimesData {
  const coordinates = new Coordinates(latitude, longitude);
  const params = CalculationMethod.MoonsightingCommittee();
  const prayerTimes = new PrayerTimes(coordinates, date, params);
  const sunnahTimes = new SunnahTimes(prayerTimes);

  // Get current time
  const now = new Date();

  // Determine current and next prayer
  const currentPrayer = getCurrentPrayer(prayerTimes, now);
  const nextPrayer = getNextPrayer(prayerTimes, now);

  const formattedTimes: PrayerTimesData = {
    fajr: {
      name: "Fajr",
      time: prayerTimes.fajr,
      isNext: nextPrayer === "fajr",
      isCurrent: currentPrayer === "fajr",
    },
    sunrise: {
      name: "Sunrise",
      time: prayerTimes.sunrise,
      isNext: nextPrayer === "sunrise",
      isCurrent: false, // Sunrise is not considered a prayer time
    },
    dhuhr: {
      name: "Dhuhr",
      time: prayerTimes.dhuhr,
      isNext: nextPrayer === "dhuhr",
      isCurrent: currentPrayer === "dhuhr",
    },
    asr: {
      name: "Asr",
      time: prayerTimes.asr,
      isNext: nextPrayer === "asr",
      isCurrent: currentPrayer === "asr",
    },
    maghrib: {
      name: "Maghrib",
      time: prayerTimes.maghrib,
      isNext: nextPrayer === "maghrib",
      isCurrent: currentPrayer === "maghrib",
    },
    isha: {
      name: "Isha",
      time: prayerTimes.isha,
      isNext: nextPrayer === "isha",
      isCurrent: currentPrayer === "isha",
    },
    nextPrayer: nextPrayer,
    currentPrayer: currentPrayer,
    nextPrayerTime: prayerTimes[nextPrayer as keyof PrayerTimes] as Date,
  };

  return formattedTimes;
}

function getCurrentPrayer(prayerTimes: PrayerTimes, now: Date): string | null {
  const prayers = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
  let currentPrayer = null;

  for (let i = 0; i < prayers.length; i++) {
    const prayer = prayers[i];
    const nextPrayer = prayers[i + 1];

    const prayerTime = prayerTimes[prayer as keyof PrayerTimes] as Date;
    const nextPrayerTime = nextPrayer
      ? (prayerTimes[nextPrayer as keyof PrayerTimes] as Date)
      : null;

    if (now >= prayerTime && (!nextPrayerTime || now < nextPrayerTime)) {
      // Skip sunrise as it's not a prayer time
      if (prayer !== "sunrise") {
        currentPrayer = prayer;
      }
      break;
    }
  }

  // Handle case after Isha until midnight
  if (!currentPrayer && now >= prayerTimes.isha) {
    currentPrayer = "isha";
  }

  return currentPrayer;
}

function getNextPrayer(prayerTimes: PrayerTimes, now: Date): string {
  const prayers = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];

  // Find the next prayer time
  for (const prayer of prayers) {
    const prayerTime = prayerTimes[prayer as keyof PrayerTimes] as Date;
    if (now < prayerTime) {
      return prayer;
    }
  }

  // If all prayers for today have passed, the next prayer is Fajr tomorrow
  return "fajr";
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function calculateTimeRemaining(targetTime: Date): string {
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
}
