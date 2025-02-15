import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import { editProfileService } from '@/services/authService';
import commonStyles from '@/styles/CommonStyles';
import TutorEdit from '@/components/Tutor/tutorEdit';
import LineBreak from '@/components/General/NonInteractive/lineBreak';
import * as ImagePicker from 'expo-image-picker';
import Button from '@/components/General/Interactive/Button';

export default function ProfileEditScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profile, setProfile] = useState<any | null>(null);
  const [profilePictureUri, setProfilePictureUri] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
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
  console.log(profile)
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

      await editProfileService(updatedProfile, profilePicture);

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
    router.push('/(tabs)/profile');
  };

  const handleUpdateTutor = (updatedTutor: any) => {
    setProfile((prevProfile: any) => ({
      ...prevProfile,
      tutor: updatedTutor,
    }));
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(words.error, words.permissionError);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfilePictureUri(uri);

      const fileInfo = {
        uri,
        name: uri.split('/').pop() || 'photo.jpg',
        type: 'image/jpeg',
      };
      setProfilePicture(fileInfo as unknown as File);
    }
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
          {profilePictureUri && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: profilePictureUri }} style={styles.image} />
            </View>
          )}
          <View style={{marginBottom: 8}}>
            <Button label={words.chooseImage} onPress={pickImage} />
          </View>


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
    marginVertical: 16,
    alignItems: 'center',
  },
  buttonFirst: {
    marginRight: 16,
    flex: 1,
  },
  buttonContainer: {
    flex: 1.5,
  },
  imageContainer: {
    marginTop: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: Colors.deepGrey,
  },
});