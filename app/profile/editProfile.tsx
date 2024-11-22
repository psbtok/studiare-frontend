import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '@/components/interactive/Button';
import { useRouter } from 'expo-router';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import { editProfileService } from '../services/authService';
import commonStyles from '@/styles/CommonStyles';

export default function EditProfileScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('profile');
        if (storedProfile) {
          const profile = JSON.parse(storedProfile);
          setFirstName(profile.user.first_name);
          setLastName(profile.user.last_name);
        }
      } catch (error) {
        console.error('Failed to load profile for editing:', error);
      }
    };

    loadProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      await editProfileService(firstName, lastName);
      Alert.alert(
        words.success,
        words.profileUpdated,
        [
          {
            text: words.ok,
            onPress: () => {
              router.back();
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

  return (
    <View style={styles.container}>
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
      </View>

      <View style={styles.buttonBlock}>
        <View style={[styles.buttonContainer, styles.buttonFirst]}>
          <Button label={words.cancel} onPress={handleCancel} />
        </View>
        <View style={styles.buttonContainer}>
          <Button theme="primary" label={words.saveDetails} onPress={handleSaveProfile} />
        </View>
      </View>
    </View>
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
  },
  buttonContainer: {
    flex: 1,
  },
  cancelButton: {
    marginTop: 16,
    backgroundColor: Colors.lightGrey,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.deepGrey,
  },
});
