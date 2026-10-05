import { Alert, Platform } from "react-native";

/** Destructive-action confirmation that also works on web (where Alert buttons are unsupported). */
export function confirm(title: string, message: string, onConfirm: () => void, confirmLabel = "Delete") {
  if (Platform.OS === "web") {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: "Cancel", style: "cancel" },
    { text: confirmLabel, style: "destructive", onPress: onConfirm },
  ]);
}

/** Tells the user a change didn't save (e.g. offline). */
export function showError(message = "Couldn't save that change. Check your connection and try again.") {
  if (Platform.OS === "web") console.warn(message);
  else Alert.alert("Something went wrong", message);
}
