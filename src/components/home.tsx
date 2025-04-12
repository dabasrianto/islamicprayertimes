import { useState, useEffect } from "react";
import PrayerTimes from "./prayer-times";

function Home() {
  // Use a fixed background
  const bgStyle = {
    backgroundImage: `url("https://images.unsplash.com/photo-1564769625688-8654b7f50628?w=1200&q=80")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  };

  return (
    <div className="w-screen min-h-screen" style={bgStyle} id="main-background">
      <div className="w-full min-h-screen bg-background/95 backdrop-blur-sm">
        <PrayerTimes />
      </div>
    </div>
  );
}

export default Home;
