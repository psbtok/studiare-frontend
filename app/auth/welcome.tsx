import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '@/components/Interactive/Button';
import { useRouter } from 'expo-router';
import { Colors } from '@/styles/Colors';
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
    backgroundColor: Colors.paleGrey,
  },
  header: {
    flex: 1, 
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.deepGrey,
    marginTop: -18,
    overflow: 'visible'
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: Colors.deepGrey,
    textAlign: 'center',
  },
  footer: {
    marginBottom: 32,
  },
});
