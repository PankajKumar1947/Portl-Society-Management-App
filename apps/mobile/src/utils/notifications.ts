import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useRegisterFcmToken } from "@repo/operations";
import { Routes } from "@/constants";
import { useAuth } from "@/context/auth-context";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function redirect(notification: Notifications.Notification) {
  const data = notification.request.content.data;
  const type = data?.type as string | undefined;
  const logId = data?.logId as string | undefined;

  if (type === "visitor_request" && logId) {
    router.push(Routes.Visitors.Approval(logId));
  } else if ((type === "visitor_approved" || type === "visitor_rejected") && logId) {
    router.push(Routes.Visitors.Pass(logId) as any);
  }
}

export function useNotificationObserver() {
  const { isAuthenticated } = useAuth();
  const { mutate: registerToken } = useRegisterFcmToken();
  const registeredRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function registerPush() {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
        });
      }

      const perms = await Notifications.requestPermissionsAsync() as { granted: boolean };
      if (!perms.granted) return;

      try {
        const pushToken = await Notifications.getDevicePushTokenAsync();
        if (pushToken.data) {
          registerToken({ token: pushToken.data });
        }
      } catch {
        // getDevicePushTokenAsync may fail in Expo Go
      }
    }

    if (!registeredRef.current) {
      registeredRef.current = true;
      registerPush();
    }
  }, [isAuthenticated, registerToken]);

  useEffect(() => {
    const response = Notifications.getLastNotificationResponse();
    if (response?.notification) {
      redirect(response.notification);
    }

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        redirect(response.notification);
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);
}
