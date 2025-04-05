import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell } from "lucide-react";

export default function NotificationToggle() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permissionState, setPermissionState] =
    useState<NotificationPermission | null>(null);

  useEffect(() => {
    // Check if browser supports notifications
    if ("Notification" in window) {
      setPermissionState(Notification.permission);

      // Check if notifications were previously enabled
      const savedState = localStorage.getItem("prayerNotifications");
      if (savedState === "true" && Notification.permission === "granted") {
        setNotificationsEnabled(true);
      }
    }
  }, []);

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      // Enable notifications
      if (permissionState !== "granted") {
        try {
          const permission = await Notification.requestPermission();
          setPermissionState(permission);

          if (permission === "granted") {
            setNotificationsEnabled(true);
            localStorage.setItem("prayerNotifications", "true");
            // Show a test notification
            new Notification("Prayer Time Notifications Enabled", {
              body: "You will now receive notifications before prayer times.",
              icon: "/vite.svg",
            });
          }
        } catch (error) {
          console.error("Error requesting notification permission:", error);
        }
      } else {
        setNotificationsEnabled(true);
        localStorage.setItem("prayerNotifications", "true");
      }
    } else {
      // Disable notifications
      setNotificationsEnabled(false);
      localStorage.setItem("prayerNotifications", "false");
    }
  };

  // If browser doesn't support notifications, don't render the component
  if (!("Notification" in window)) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="notifications"
        checked={notificationsEnabled}
        onCheckedChange={handleToggleNotifications}
        disabled={permissionState === "denied"}
      />
      <div className="flex flex-col">
        <Label htmlFor="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Prayer Notifications
        </Label>
        {permissionState === "denied" && (
          <p className="text-xs text-destructive">
            Notifications blocked. Please enable in browser settings.
          </p>
        )}
      </div>
    </div>
  );
}
