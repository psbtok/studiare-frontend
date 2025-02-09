import HeaderSmall from '@/components/General/Header/HeaderSmall';
import words from '@/locales/ru';
import { Stack, useNavigation } from 'expo-router';
import { useEffect } from 'react';

export default function AuthLayout() {
  const navigation = useNavigation();
  
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  
  return (
    <Stack
      screenOptions={{
        header: ({ navigation }) => (
          <HeaderSmall
            title={words.subject}
            showBackButton={true}
          />
        ),
      }}
    >
      <Stack.Screen name="subjectCreate"/>
      <Stack.Screen name="subjectEdit"/>

    </Stack>
  );
}
