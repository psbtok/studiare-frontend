import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/styles/Colors'; // Adjust import paths as needed
import { Typography } from '@/styles/Typography';

function PersonBadge({ name }: { name: string }) {
  return (
    <View style={styles.personContainer}>
      <Text style={styles.person}>{name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  personContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: -10,
  },
  person: {
    color: Colors.mediumGrey,
    fontSize: Typography.fontSizes.s,
    fontWeight: '500',
    backgroundColor: Colors.lightGrey,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexShrink: 1,
  },
});

export default PersonBadge;
