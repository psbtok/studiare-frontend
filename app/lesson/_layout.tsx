import { Stack, useNavigation } from 'expo-router';
import HeaderSmall from '@/components/General/Header/HeaderSmall';
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
          <HeaderSmall
            title={words.aboutLesson}
            showBackButton={true}
            showAgreement={true}
          />
        ),
      }}
    >
      <Stack.Screen name="lessonDetail" />
      <Stack.Screen name="lessonEdit" />
      <Stack.Screen
        name="lessonInfo"
        options={{
          header: ({ navigation }) => (
            <HeaderSmall
              title={words.info}
              showBackButton={true}
              showAgreement={false}
            />
          ),
        }}
      />
    </Stack>
  );
}