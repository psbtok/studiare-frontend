import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import { Colors } from '@/styles/Colors';
import commonStyles from '@/styles/CommonStyles';
import words from '@/locales/ru';
import RoleSelector from '@/components/RoleSelector';
import { editProfileService } from '../services/authService';

export default function RegistrationDetailsScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isTutor, setIsTutor] = useState(false);
  const router = useRouter();

  const submitDetails = async () => {
    try {
      await editProfileService(firstName, lastName, isTutor);

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
