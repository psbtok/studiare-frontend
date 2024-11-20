import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import Button from '@/components/Button';
import { loginService } from '../services/authService';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import words from '@/locales/ru';

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
      <Text style={styles.label}>{words.username}</Text>
      <TextInput
        style={styles.input}
        placeholder={words.enterUsername}
        placeholderTextColor={Colors.darkGrey}
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>{words.password}</Text>
      <TextInput
        style={styles.input}
        placeholder={words.enterPassword}
        placeholderTextColor={Colors.darkGrey}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button theme="primary" label={words.login} onPress={login} /> 
      <Text
        style={styles.link}
        onPress={() => router.replace('/auth/register')}
      >
        {words.noAccount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: Colors.lightGrey,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.darkGrey,
  },
  input: {
    height: 40,
    color: Colors.darkGrey,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  link: {
    color: Colors.darkGrey,
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginVertical: 20,
  },
});
