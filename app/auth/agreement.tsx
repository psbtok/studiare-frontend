import React, { useState } from 'react';
import { View, Text, StyleSheet, Linking, Alert } from 'react-native';
import Button from '@/components/General/Interactive/Button';
import { useRouter } from 'expo-router';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import AgreementSwitch from '@/components/General/Interactive/agreementSwitch';
import { Typography } from '@/styles/Typography';

export default function AgreementScreen() {
  const [isAgreed, setIsAgreed] = useState(false);
  const router = useRouter();

  const handleLinkPress = () => {
    Linking.openURL('https://example.com/terms-and-conditions');
  };

  const proceed = () => {
    if (!isAgreed) {
      Alert.alert(words.error, words.agreeToContinue);
      return;
    }
    router.push('/auth/registrationDetails'); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{words.agreementTitle}</Text>
        
        <Text style={styles.text}>
          {words.agreementText}
          <Text style={styles.link} onPress={handleLinkPress}>
            {words.agreementLink}
          </Text>
        </Text>

        <AgreementSwitch isAgreed={isAgreed} setIsAgreed={setIsAgreed} />
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          theme="primary"
          label={words.proceed}
          onPress={proceed}
          disabled={!isAgreed}
        />
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
  text: {
    fontSize: Typography.fontSizes.m,
    color: Colors.deepGrey,
    marginBottom: 24,
    textAlign: 'left',
  },
  link: {
    color: Colors.deepGrey,
    textDecorationLine: 'underline',
  },
  buttonWrapper: {
    marginTop: 40, 
    marginBottom: 20, 
  },
});