import { Redirect } from "expo-router";

/**
 * Apple/Google sign-in returns to basecamp://auth/callback. The sign-in screen finishes the
 * session itself; if the OS also opens this route, just go home.
 */
export default function AuthCallback() {
  return <Redirect href="/" />;
}
