import { View, StyleSheet, Platform, Text } from 'react-native';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import CalendarList from '@/components/Calendar/CalendarList';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('login-token');
        if (!token) {
          router.replace('/auth/login');
        }
      } catch (e) {
        console.error('Error reading token', e);
      }
    };
  
    checkToken();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <CalendarList />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});
