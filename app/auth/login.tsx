import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import Button from '@/components/General/Interactive/Button';
import { loginService } from '@/services/authService';
import { useRouter } from 'expo-router';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import { Typography } from '@/styles/Typography';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const login = async () => {
    try {
      await loginService(username, password);
      router.replace('/');
    } catch (error: any) {
      Alert.alert(words.loginFailed, error.message); 
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.loginContainer}>
        <Text style={styles.welcomeText}>{words.welcomeBack}</Text>
        <TextInput
          style={styles.input}
          placeholder={words.enterEmail}
          placeholderTextColor={Colors.mediumGrey}
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder={words.password}
          placeholderTextColor={Colors.mediumGrey}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button theme="primary" label={words.login} onPress={login} /> 
      </View>

      <Text style={styles.link}>
        {words.noAccount + ' '} 
        <Text 
          style={[styles.link, styles.linkHighlight]} 
          onPress={() => router.replace('/auth/register')}
        >
          {words.doRegister}
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
  welcomeText: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.deepGrey,
    marginBottom: 24
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -50,
  },
  label: {
    fontSize: Typography.fontSizes.s,
    marginBottom: 8,
    color: Colors.deepGrey,
  },
  input: {
    paddingLeft: 16,
    color: Colors.mediumGrey,
    borderColor: Colors.mediumGrey,
    backgroundColor: Colors.lightGrey,
    borderWidth: 2,
    height: 64,
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  link: {
    color: Colors.deepGrey,
    textAlign: 'center',
    marginVertical: 20
  },
  linkHighlight: {
    color: Colors.skyBlue,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid'
  }
});
