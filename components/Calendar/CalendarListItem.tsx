import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CalendarListItem({ day, date }: {day: string, date: string}) {
  return (
    <View style={styles.container}>
      <Text style={styles.day}>{day}</Text>
      <Text style={styles.date}>{date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  day: {
    fontSize: 16,
    color: '#fff',
  },
  date: {
    fontSize: 14,
    color: '#fff',
  },
});
