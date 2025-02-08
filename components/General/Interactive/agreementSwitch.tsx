import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import { Typography } from '@/styles/Typography';

export default function AgreementSwitch({ isAgreed, setIsAgreed }: { isAgreed: boolean; setIsAgreed: (value: boolean) => void }) {
  return (
    <View style={styles.switchContainer}>
      <TouchableOpacity
        style={[styles.switchButton, isAgreed ? styles.activeSwitch : styles.inactiveSwitch]}
        onPress={() => setIsAgreed(!isAgreed)}
      >
        <Text style={[styles.switchText, isAgreed ? styles.activeText : styles.inactiveText]}>
          {isAgreed ? words.agreed : words.notAgreed}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  switchContainer: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: Colors.lightGrey,
    marginBottom: 16,
  },
  switchButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
  },
  activeSwitch: {
    backgroundColor: Colors.deepGrey,
    borderColor: Colors.deepGrey
  },
  inactiveSwitch: {
    borderColor: Colors.mediumGrey,
    backgroundColor: Colors.lightGrey,
  },
  switchText: {
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