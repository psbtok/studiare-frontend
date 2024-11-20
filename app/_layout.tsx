import { Stack } from 'expo-router';
import { setStatusBarStyle, setStatusBarBackgroundColor } from "expo-status-bar";
import { useEffect } from "react";
import { Colors } from '@/constants/Colors';

export default function RootLayout() {
  useEffect(() => {
    setTimeout(() => {
      setStatusBarStyle("dark");
      setStatusBarBackgroundColor(Colors.lightGrey)
    }, 0);
  }, []);
  
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
    </Stack>
  );
}
