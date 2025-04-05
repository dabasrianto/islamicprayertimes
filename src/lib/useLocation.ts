import { useState, useEffect } from "react";

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  loading: boolean;
  error: string | null;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationData>({
    latitude: 0,
    longitude: 0,
    city: "",
    country: "",
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check if we have saved location in localStorage
    const savedLocation = localStorage.getItem("prayerLocation");
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        setLocation({
          ...parsedLocation,
          loading: false,
          error: null,
        });
        return;
      } catch (e) {
        // If parsing fails, continue to get new location
        localStorage.removeItem("prayerLocation");
      }
    }

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Reverse geocoding to get city and country
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
            );
            const data = await response.json();

            const locationData = {
              latitude,
              longitude,
              city:
                data.address.city ||
                data.address.town ||
                data.address.village ||
                "Unknown",
              country: data.address.country || "Unknown",
              loading: false,
              error: null,
            };

            // Save to localStorage
            localStorage.setItem(
              "prayerLocation",
              JSON.stringify(locationData),
            );

            setLocation(locationData);
          } catch (error) {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              city: "Unknown",
              country: "Unknown",
              loading: false,
              error: null,
            });
          }
        },
        (error) => {
          setLocation({
            latitude: 0,
            longitude: 0,
            city: "",
            country: "",
            loading: false,
            error: `Location access denied: ${error.message}`,
          });
        },
      );
    } else {
      setLocation({
        latitude: 0,
        longitude: 0,
        city: "",
        country: "",
        loading: false,
        error: "Geolocation is not supported by this browser.",
      });
    }
  }, []);

  const updateLocation = async (latitude: number, longitude: number) => {
    setLocation((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Reverse geocoding to get city and country
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
      );
      const data = await response.json();

      const locationData = {
        latitude,
        longitude,
        city:
          data.address.city ||
          data.address.town ||
          data.address.village ||
          "Unknown",
        country: data.address.country || "Unknown",
        loading: false,
        error: null,
      };

      // Save to localStorage
      localStorage.setItem("prayerLocation", JSON.stringify(locationData));

      setLocation(locationData);
    } catch (error) {
      setLocation({
        latitude,
        longitude,
        city: "Unknown",
        country: "Unknown",
        loading: false,
        error: null,
      });
    }
  };

  return { location, updateLocation };
}
