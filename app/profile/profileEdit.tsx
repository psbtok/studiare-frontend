import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '@/components/General/Interactive/Button';
import { useRouter } from 'expo-router';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import { editProfileService } from '@/services/authService';
import commonStyles from '@/styles/CommonStyles';
import TutorEdit from '@/components/Tutor/tutorEdit';
import LineBreak from '@/components/General/NonInteractive/lineBreak';

export default function ProfileEditScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profile, setProfile] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('profile');
        if (storedProfile) {
          const profile = JSON.parse(storedProfile);
          setFirstName(profile.user.first_name);
          setLastName(profile.user.last_name);
          setProfile(profile);
        }
      } catch (error) {
        console.error('Failed to load profile for editing:', error);
      }
    };

    loadProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const updatedProfile = {
        ...profile,
        user: {
          ...profile.user,
          first_name: firstName,
          last_name: lastName,
        },
      };

      await editProfileService(updatedProfile);

      Alert.alert(
        words.success,
        words.profileUpdated,
        [
          {
            text: words.ok,
            onPress: () => {
              router.replace('/profile');
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      Alert.alert(words.error, error.message);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleUpdateTutor = (updatedTutor: any) => {
    setProfile((prevProfile: any) => ({
      ...prevProfile,
      tutor: updatedTutor,
    }));
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={commonStyles.label}>{words.firstName}</Text>
          <TextInput
            style={commonStyles.input}
            placeholder={words.enterFirstName}
            placeholderTextColor={Colors.mediumGrey}
            value={firstName}
            onChangeText={setFirstName}
          />

          <Text style={commonStyles.label}>{words.lastName}</Text>
          <TextInput
            style={commonStyles.input}
            placeholder={words.enterLastName}
            placeholderTextColor={Colors.mediumGrey}
            value={lastName}
            onChangeText={setLastName}
          />
          <LineBreak />
          {profile?.is_tutor && (
            <TutorEdit tutor={profile.tutor} onUpdateTutor={handleUpdateTutor} />
          )}
        </View>
      </ScrollView>

      <View style={styles.buttonBlock}>
        <View style={[styles.buttonContainer, styles.buttonFirst]}>
          <Button label={words.cancel} onPress={handleCancel} />
        </View>
        <View style={styles.buttonContainer}>
          <Button theme="primary" label={words.save} onPress={handleSaveProfile} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: Colors.paleGrey,
  },
  scrollViewContent: {
    paddingBottom: 20, 
  },
  buttonBlock: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    marginTop: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonFirst: {
    marginRight: 16,
    flex: 1,
  },
  buttonContainer: {
    flex: 1.5
  },
});
