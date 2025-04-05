import PrayerTimes from "./prayer-times";

function Home() {
  return (
    <div className="w-screen min-h-screen bg-[url('https://images.unsplash.com/photo-1564769625688-8654b7f50628?w=1200&q=80')] bg-cover bg-center bg-fixed">
      <div className="w-full min-h-screen bg-background/95 backdrop-blur-sm">
        <PrayerTimes />
      </div>
    </div>
  );
}

export default Home;
