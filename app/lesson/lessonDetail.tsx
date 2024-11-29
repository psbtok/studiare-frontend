import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/styles/Colors';
import { Typography } from '@/styles/Typography';
import { useLocalSearchParams } from 'expo-router';
import { Lesson } from '@/models/models';
import words from '@/locales/ru';

export default function LessonDetailScreen() {
  const { lesson } = useLocalSearchParams();

  const lessonString = Array.isArray(lesson) ? lesson[0] : lesson;
  
  const parsedLesson: Lesson = JSON.parse(lessonString);

  return (
    <View style={styles.container}>
      <Text style={styles.subject}>{parsedLesson.subject}</Text>
      <Text style={styles.details}>
        {parsedLesson.student.first_name} {parsedLesson.student.last_name}
      </Text>
      <Text style={styles.details}>
        {parsedLesson.price} {words.currency}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.paleGrey,
  },
  subject: {
    fontSize: Typography.fontSizes.l,
    fontWeight: 'bold',
    color: Colors.deepGrey,
  },
  details: {
    fontSize: Typography.fontSizes.m,
    color: Colors.mediumGrey,
  },
});
