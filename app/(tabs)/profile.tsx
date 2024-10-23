import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '@/components/Button';
import { logoutService } from '../services/authService';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        }
      } catch (error) {
        console.error('Failed to load username:', error);
      }
    };

    fetchUsername();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutService();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {username ? (
        <Text style={styles.username}>Username: {username}</Text>
      ) : (
        <Text style={styles.username}>Loading username...</Text>
      )}
      <Button theme="primary" label="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25292e',
  },
  title: {
    fontSize: 24,
    color: '#ffd33d',
    marginBottom: 16,
  },
  username: {
    fontSize: 18,
    color: '#fff',
  },
});
