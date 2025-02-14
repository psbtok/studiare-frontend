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
import ProfileSubjectChart from '@/components/Profile/profileSubjectChart';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchProfile = async (force=false) => {
    try {
      const storedProfile = await AsyncStorage.getItem('profile');
      if (storedProfile && !force) {
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
      await Promise.all([fetchProfile(true), fetchBalance()]);
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
            <View style={styles.header}>
              <View style={styles.headerContainer}>
                <Text style={styles.name}>{profile.user.last_name} {profile.user.first_name}</Text>
                <Text style={styles.email}>{profile.user.email}</Text>
              </View>
              <BalanceTile balance={balance !== null ? balance : 0} />
            </View>
            {profile.is_tutor && <TutorStatistics />}
            <View>
              <ProfileSubjectChart/>
            </View>
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
    padding: 16,
    paddingTop: 8,
    backgroundColor: Colors.paleGrey,
  },
  emailBlock: {
  },
  profileDetails: {
    width: '100%',
  },
  info: {
    fontSize: Typography.fontSizes.m,
    color: Colors.deepGrey,
  },
  loading: {
    fontSize: Typography.fontSizes.m,
    color: Colors.mediumGrey,
  },
  header: {
    paddingTop: 8,
    backgroundColor: Colors.deepGrey,
    borderRadius: 12,
  },
  headerContainer: {
    flexDirection: 'column',
    paddingHorizontal: 24,
    paddingTop: 2,
  },
  name: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: 500,
    color: Colors.paleGrey
  },
  email: {
    fontSize: Typography.fontSizes.l,
    fontWeight: 500,
    marginTop: -3,
    color: Colors.stoneGrey
  },
  
});