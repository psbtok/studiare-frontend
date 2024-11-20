import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import words from '@/locales/ru';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{words.welcome.split(' ')[0]}</Text>
        <Text style={styles.title}>{words.welcome.split(' ')[1]}</Text>
        <Text style={styles.subtitle}>{words.slogan}</Text>
      </View>

      <View style={styles.footer}>
        <View style={{ marginBottom: 16 }}>
          <Button
            theme="primary"
            label={words.login}
            onPress={() => router.push('/auth/login')}
          />
        </View>
        <Button
          label={words.register}
          onPress={() => router.push('/auth/register')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    backgroundColor: Colors.lightGrey,
  },
  header: {
    flex: 1, 
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 64,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.darkGrey,
    marginTop: -18,
    overflow: 'visible'
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: Colors.darkGrey,
    textAlign: 'center',
  },
  footer: {
    marginBottom: 30,
  },
});
