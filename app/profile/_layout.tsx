import { Stack, useNavigation  } from 'expo-router';
import Header from '@/components/General/Header/Header';
import words from '@/locales/ru';
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
          <Header
            title={words.profileEdit} 
            showBackButton={true}
            onBackPress={navigation.goBack}
          />
        ),
      }}
    >
      <Stack.Screen name="profileEdit" />
    </Stack>
  );
}
