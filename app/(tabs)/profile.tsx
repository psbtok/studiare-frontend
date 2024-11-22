import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '@/components/interactive/Button';
import { useRouter } from 'expo-router';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import commonStyles from '@/styles/CommonStyles';

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

  const handleEditProfile = () => {
    router.push('/profile/editProfile');
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileDetails}>
        {profile ? (
          <View>
            <View>
              <Text style={[commonStyles.label, styles.emailBlock]}>{words.email}: </Text>
              <Text style={styles.info}>
                {profile.user.email}
              </Text>
            </View>
            <Text style={styles.info}>
              <Text style={commonStyles.label}>{words.fullName}: </Text>
              {profile.user.last_name} {profile.user.first_name}
            </Text>
            <Text style={styles.info}>
              <Text style={commonStyles.label}>{words.role}: </Text>
              {profile.is_tutor ? words.tutor : words.student}
            </Text>
          </View>
        ) : (
          <Text style={styles.loading}>{words.loadingProfile}</Text>
        )}
      </View>
      <View>
        <Button theme="primary" label={words.edit} onPress={handleEditProfile} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.paleGrey,
  },
  emailBlock: {
    marginBottom: 0
  },
  profileDetails: {
    width: '100%',
    marginBottom: 24,
  },
  info: {
    fontSize: 18,
    color: Colors.deepGrey,
    marginBottom: 8,
  },
  loading: {
    fontSize: 18,
    color: Colors.mediumGrey,
    marginBottom: 24,
  },
});
