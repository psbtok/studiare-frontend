import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '@/components/General/Interactive/Button';
import { useRouter } from 'expo-router';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import commonStyles from '@/styles/CommonStyles';
import { getBalanceService } from '@/services/balanceService';
import TutorDetails from '@/components/Tutor/tutorDetails';
import BalanceTile from '@/components/Balance/balanceTile';
import { Typography } from '@/styles/Typography';
import { getProfileService } from '@/services/authService';
import TutorStatistics from '@/components/Tutor/tutorStatistics';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem('profile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      } else {
        const fetchedProfile = await getProfileService();
        setProfile(fetchedProfile);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      setError(words.error);
    }
  };

  const fetchBalance = async () => {
    try {
      const userBalance = await getBalanceService();
      setBalance(userBalance);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchProfile(), fetchBalance()]);
    } catch (error: any) {
      Alert.alert(words.error, error.message || words.error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchProfile();
      await fetchBalance();
    };
    fetchData();
  }, []);

  if (loading && !profile && !balance) {
    return <Text>{words.loading}</Text>;
  }

  if (error) {
    return <Text>{words.error}</Text>;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.deepGrey]} />
      }
    >
      <View style={styles.profileDetails}>
        {profile ? (
          <View>
            <View>
              <BalanceTile balance={balance !== null ? balance : 0} />
              {profile.is_tutor && <TutorStatistics />}
            </View>
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
            {profile.is_tutor && <TutorDetails tutor={profile.tutor} />}
          </View>
        ) : (
          <Text style={styles.loading}>{words.loadingProfile}</Text>
        )}
      </View>
      <View>
        <Button theme="primary" label={words.edit} onPress={handleEditProfile} />
      </View>
    </ScrollView>
  );

  function handleEditProfile() {
    router.push('/profile/profileEdit');
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.paleGrey,
  },
  emailBlock: {
    marginBottom: 0,
  },
  profileDetails: {
    width: '100%',
    marginBottom: 24,
  },
  info: {
    fontSize: Typography.fontSizes.m,
    color: Colors.deepGrey,
    marginBottom: 8,
  },
  loading: {
    fontSize: Typography.fontSizes.m,
    color: Colors.mediumGrey,
    marginBottom: 24,
  },
});