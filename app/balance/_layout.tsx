import { Stack } from 'expo-router';
import HeaderSmall from '@/components/General/Header/HeaderSmall';
import words from '@/locales/ru';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        header: ({ navigation }) => (
          <HeaderSmall
            title={words.balaceTopUp} 
            showBackButton={true}
            onBackPress={navigation.goBack}
          />
        ),
      }}
    >
      <Stack.Screen name="topup" options={{ headerShown: false }} />
    </Stack>
  );
}
