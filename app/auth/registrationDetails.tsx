import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import Button from '@/components/Interactive/Button';
import { useRouter } from 'expo-router';
import { Colors } from '@/styles/Colors';
import commonStyles from '@/styles/CommonStyles';
import words from '@/locales/ru';
import RoleSelector from '@/components/Interactive/RoleSelector';
import { editProfileService } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegistrationDetailsScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isTutor, setIsTutor] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  // Загрузка текущего профиля из AsyncStorage
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

  // Отправка обновленных данных профиля
  const submitDetails = async () => {
    if (!firstName || !lastName) {
      Alert.alert(words.error, words.fillRequiredFields);
      return;
    }

    const updatedProfile = {
      ...profile, // Используем текущий профиль
      user: {
        ...profile.user,
        first_name: firstName, // Обновляем имя
        last_name: lastName, // Обновляем фамилию
      },
      is_tutor: isTutor, // Обновляем роль
    };

    try {
      // Здесь мы передаем весь обновленный профиль в сервис
      await editProfileService(updatedProfile);

      // Обновляем локальное хранилище
      await AsyncStorage.setItem('profile', JSON.stringify(updatedProfile));

      Alert.alert('', words.registrationDetailsSaved);
      router.replace('/'); // Перенаправление после успешного обновления
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

        <Button theme="primary" label={words.saveDetails} onPress={submitDetails} />
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
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.deepGrey,
    marginBottom: 24,
    textAlign: 'left',
  },
});
