import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '@/components/Button';
import { logoutService } from '../services/authService';
import { useRouter } from 'expo-router';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('profile');
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutService();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert(words.error, words.logoutFailed);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{words.profile}</Text>
      {profile ? (
        <View style={styles.profileDetails}>
          <Text style={styles.info}>
            <Text style={styles.label}>{words.email}: </Text>
            {profile.user.email}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>{words.firstName}: </Text>
            {profile.user.first_name}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>{words.lastName}: </Text>
            {profile.user.last_name}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>{words.role}: </Text>
            {profile.is_tutor ? words.tutor : words.student}
          </Text>
        </View>
      ) : (
        <Text style={styles.loading}>{words.loadingProfile}</Text>
      )}
      <Button theme="primary" label={words.logout} onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.paleGrey,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.deepGrey,
    marginBottom: 24,
  },
  profileDetails: {
    marginBottom: 24,
    alignSelf: 'stretch',
  },
  info: {
    fontSize: 18,
    color: Colors.deepGrey,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: Colors.mediumGrey,
  },
  loading: {
    fontSize: 18,
    color: Colors.mediumGrey,
    marginBottom: 24,
  },
});
