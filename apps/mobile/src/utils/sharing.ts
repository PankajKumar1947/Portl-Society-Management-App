import { Share } from "react-native";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";

interface SharePassOptions {
  viewRef: React.RefObject<any>;
  passId?: string;
  dialogTitle?: string;
}

export async function sharePassAsImage({
  viewRef,
  passId,
  dialogTitle = "Share Pass",
}: SharePassOptions): Promise<void> {
  try {
    const uri = await captureRef(viewRef, {
      format: "png",
      quality: 0.95,
    });
    await Sharing.shareAsync(uri, {
      mimeType: "image/png",
      dialogTitle,
    });
  } catch (error) {
    console.error("Failed to capture and share pass image:", error);
    if (passId) {
      await Share.share({
        message: `My Pass ID: ${passId}\nShow this at the gate.`,
      });
    }
  }
}
