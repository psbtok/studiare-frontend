import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Lesson } from '@/models/models';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import { Typography } from '@/styles/Typography';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

function LessonListItem(props: { lesson: Lesson }) {
  const { lesson } = props;
  const router = useRouter();

  const formattedTimeStart = format(new Date(lesson.date_start), 'HH:mm', { locale: ru });
  const formattedTimeEnd = format(new Date(lesson.date_end), 'HH:mm', { locale: ru });

  return (
    <TouchableOpacity
      style={styles.lessonItem}
      onPress={() =>
        router.push({
          pathname: '/lesson/lessonDetail',
          params: { lesson: JSON.stringify(lesson) }
        })
      }
>

      <Text style={styles.subject}>{lesson.subject}</Text>
      <View style={styles.personContainer}>
        <Text style={styles.person}>
          {lesson.student.last_name} {lesson.student.first_name}
        </Text>
      </View>
      <View style={styles.lessonDetails}>
        <Text style={styles.dates}>
          {formattedTimeStart} - {formattedTimeEnd}
        </Text>
        <Text style={styles.price}>
          {lesson.price ?? 0} {words.currency}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  lessonItem: {
    minWidth: '100%',
    backgroundColor: Colors.paleGrey,
    padding: 12,
    paddingHorizontal: 22,
    paddingRight: 12,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: Colors.deepGrey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 4,
  },
  personContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: -12,
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
  lessonDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    textAlign: 'right',
    paddingVertical: 4,
    paddingHorizontal: 12,
    fontSize: Typography.fontSizes.m,
    fontWeight: 'bold',
    borderRadius: 12,
    color: Colors.lightGrey,
    backgroundColor: Colors.deepGrey,
  },
  dates: {
    fontSize: Typography.fontSizes.m,
    fontWeight: '500',
    color: Colors.mediumGrey,
  },
  subject: {
    fontSize: Typography.fontSizes.l,
    fontWeight: 'bold',
    color: Colors.deepGrey,
    flexShrink: 1,       
    flexWrap: 'wrap', 
  }
});

export default LessonListItem;
