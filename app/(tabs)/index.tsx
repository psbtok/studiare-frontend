import { View, StyleSheet, Platform, Text } from 'react-native';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import LotList from '@/components/Lot/LotList';
import { Colors } from '@/constants/Colors';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('login-token');
        if (!token) {
          router.replace('/auth/welcome');
        }
      } catch (e) {
        console.error('Error reading token', e);
      }
    };
  
    checkToken();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <LotList />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paleGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});
