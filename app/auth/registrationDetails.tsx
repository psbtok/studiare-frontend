import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import Button from '@/components/General/Interactive/Button';
import { useRouter } from 'expo-router';
import { Colors } from '@/styles/Colors';
import commonStyles from '@/styles/CommonStyles';
import words from '@/locales/ru';
import RoleSelector from '@/components/General/Interactive/RoleSelector';
import { editProfileService } from '@/services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Typography } from '@/styles/Typography';

export default function RegistrationDetailsScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isTutor, setIsTutor] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      const storedProfile = await AsyncStorage.getItem('profile');
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        setProfile(parsedProfile);
        setFirstName(parsedProfile.user.first_name);
        setLastName(parsedProfile.user.last_name);
        setIsTutor(parsedProfile.is_tutor);
      }
    };
    loadProfile();
  }, []);

  const submitDetails = async () => {
    if (!firstName || !lastName) {
      Alert.alert(words.error, words.fillRequiredFields);
      return;
    }

    const updatedProfile = {
      ...profile,
      user: {
        ...profile.user,
        first_name: firstName,
        last_name: lastName,
      },
      is_tutor: isTutor,
    };

    try {
      await editProfileService(updatedProfile);

      Alert.alert('', words.registrationDetailsSaved);
      router.replace('/'); 
    } catch (error: any) {
      console.error('Error saving profile details:', error);
      Alert.alert(words.error, error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{words.completeProfile}</Text>
        
        <TextInput
          style={commonStyles.input}
          placeholder={words.enterFirstName}
          placeholderTextColor={Colors.mediumGrey}
          value={firstName}
          onChangeText={setFirstName}
        />

        <TextInput
          style={commonStyles.input}
          placeholder={words.enterLastName}
          placeholderTextColor={Colors.mediumGrey}
          value={lastName}
          onChangeText={setLastName}
        />

        <RoleSelector isTutor={isTutor} setIsTutor={setIsTutor} />

        <Button theme="primary" label={words.save} onPress={submitDetails} inline={false} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: Colors.paleGrey,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: 'bold',
    color: Colors.deepGrey,
    marginBottom: 24,
    textAlign: 'left',
  },
});
