import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import { Typography } from '@/styles/Typography';

export default function AgreementSelector({ isAgreed, setIsAgreed }: { isAgreed: boolean; setIsAgreed: (value: boolean) => void }) {
  return (
    <View style={styles.agreementContainer}>
      <TouchableOpacity
        style={[styles.agreementButton, isAgreed ? styles.inactiveAgreement : styles.activeAgreement]}
        onPress={() => setIsAgreed(false)}
      >
        <Text style={[styles.agreementText, isAgreed ? styles.inactiveText : styles.activeText]}>
          {words.notAgreed}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.agreementButton, isAgreed ? styles.activeAgreement : styles.inactiveAgreement]}
        onPress={() => setIsAgreed(true)}
      >
        <Text style={[styles.agreementText, isAgreed ? styles.activeText : styles.inactiveText]}>
          {words.agreed}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  agreementContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 16,
    backgroundColor: Colors.lightGrey,
    padding: 4,
    paddingVertical: 6,
    marginBottom: 16,
  },
  agreementButton: {
    flex: 1,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 4,
  },
  activeAgreement: {
    backgroundColor: Colors.deepGrey,
  },
  inactiveAgreement: {
    backgroundColor: Colors.lightGrey,
  },
  agreementText: {
    fontSize: Typography.fontSizes.s,
    fontWeight: 'bold',
  },
  activeText: {
    color: Colors.paleGrey,
  },
  inactiveText: {
    color: Colors.mediumGrey,
  },
});
