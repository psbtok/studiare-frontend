import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import { Typography } from '@/styles/Typography';

export default function RoleSelector({ isTutor, setIsTutor }: { isTutor: boolean; setIsTutor: (value: boolean) => void }) {
  return (
    <View style={styles.roleContainer}>
      <TouchableOpacity
        style={[styles.roleButton, isTutor ? styles.inactiveRole : styles.activeRole]}
        onPress={() => setIsTutor(false)}
      >
        <Text style={[styles.roleText, isTutor ? styles.inactiveText : styles.activeText]}>
          {words.iAmStudent}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.roleButton, isTutor ? styles.activeRole : styles.inactiveRole]}
        onPress={() => setIsTutor(true)}
      >
        <Text style={[styles.roleText, isTutor ? styles.activeText : styles.inactiveText]}>
          {words.iAmTutor}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 16,
    backgroundColor: Colors.lightGrey,
    padding: 4,
    paddingVertical: 6,
    marginBottom: 16,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 4,
  },
  activeRole: {
    backgroundColor: Colors.deepGrey,
  },
  inactiveRole: {
    backgroundColor: Colors.lightGrey,
  },
  roleText: {
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
