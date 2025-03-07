// Existing imports remain unchanged
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '@/components/General/Interactive/Button';
import { useRouter } from 'expo-router';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import { getBalanceService } from '@/services/balanceService';
import TutorDetails from '@/components/Tutor/tutorDetails';
import BalanceTile from '@/components/Balance/balanceTile';
import { Typography } from '@/styles/Typography';
import { getProfileService } from '@/services/authService';
import TutorStatistics from '@/components/Tutor/tutorStatistics';
import ProfileSubjectChart from '@/components/Profile/profileSubjectChart';
import { Image } from 'react-native';
import Constants from 'expo-constants';
import ImageModal from '@/components/General/Interactive/imageModal';
import TutorRatingTile from '@/components/General/NonInteractive/tutorRatingTile';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? '';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState('');
  const router = useRouter();

  const fetchProfile = async (force = false) => {
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

  const handleImagePress = () => {
    setImageUri(`${API_BASE_URL.split('/api')[0]}${profile.profile_picture}`);
    setModalVisible(true);
  };

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
                <View style={styles.infoContainer}>
                  <Text style={styles.name}>
                    {profile.user.last_name} {profile.user.first_name}
                  </Text>
                  <Text style={styles.email}>{profile.user.email}</Text>
                </View>
                <TouchableOpacity style={styles.profilePicture} onPress={handleImagePress}>
                  <Image 
                    source={{ uri: `${API_BASE_URL.split('/api')[0]}${profile.profile_picture}` }} 
                    style={styles.profilePictureImage} 
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.headerFooter}>
                <BalanceTile balance={balance !== null ? balance : 0} />
                {profile.is_tutor && profile.tutor && 
                  <View style={styles.tutorRating}>
                    <TutorRatingTile profile={profile} />
                  </View>
                }
              </View>
            </View>
            {profile.is_tutor && <TutorStatistics />}
            <View>
              <ProfileSubjectChart profile={profile} />
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
      <ImageModal 
        visible={modalVisible}
        imageUri={imageUri}
        onClose={() => setModalVisible(false)} 
      />
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
  profileDetails: {
    width: '100%',
  },
  header: {
    paddingTop: 8,
    backgroundColor: Colors.deepGrey,
    borderRadius: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', 
    paddingLeft: 24,
    paddingRight: 12,
    paddingTop: 2,
  },
  infoContainer: {
    flex: 1, 
    paddingRight: 12, 
  },
  name: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: '500',
    color: Colors.paleGrey,
  },
  email: {
    fontSize: Typography.fontSizes.l,
    fontWeight: '500',
    marginTop: -3,
    color: Colors.stoneGrey,
  },
  profilePicture: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: Colors.mediumGrey,
  },
  profilePictureImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  headerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tutorRating: {
    marginRight: 12,
  },
  loading: {
    fontSize: Typography.fontSizes.m,
    color: Colors.mediumGrey,
  },
});
