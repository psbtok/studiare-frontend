import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Switch } from 'react-native';
import Button from '@/components/General/Interactive/Button';
import { useRouter } from 'expo-router';
import { registerService, loginService } from '@/services/authService';
import { Colors } from '@/styles/Colors';
import commonStyles from '@/styles/CommonStyles';
import words from '@/locales/ru';
import { Typography } from '@/styles/Typography';

export default function RegistrationScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const register = async () => {
    try {
      await registerService(email, password, confirmPassword);
      Alert.alert('', words.registrationSuccess);

      await loginService(email, password);

      router.replace('/auth/agreement');
    } catch (error: any) {
      Alert.alert(words.registrationFailed, error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.registerContainer}>
        <Text style={styles.welcomeText}>{words.createAccount}</Text>
        <TextInput
          style={commonStyles.input}
          placeholder={words.enterEmail}
          placeholderTextColor={Colors.mediumGrey}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={commonStyles.input}
          placeholder={words.enterPassword}
          placeholderTextColor={Colors.mediumGrey}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={commonStyles.input}
          placeholder={words.confirmPassword}
          placeholderTextColor={Colors.mediumGrey}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Button theme="primary" label={words.register} onPress={register} inline={false} />
      </View>

      <Text style={styles.link}>
        {words.alreadyHaveAccount + ' '}
        <Text
          style={[styles.link, styles.linkHighlight]}
          onPress={() => router.replace('/auth/login')}
        >
          {words.loginHere}
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: Colors.paleGrey,
  },
  registerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.deepGrey,
    marginBottom: 24,
    textAlign: 'left',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: Typography.fontSizes.s,
    color: Colors.deepGrey,
    marginRight: 10,
  },
  link: {
    color: Colors.deepGrey,
    textAlign: 'center',
    marginVertical: 20,
  },
  linkHighlight: {
    color: Colors.skyBlue,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
});
