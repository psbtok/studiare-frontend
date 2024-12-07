import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Lesson } from '@/models/models';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import { Typography } from '@/styles/Typography';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import PersonBadge from '../General/NonInteractive/personBadge';
import commonStyles from '@/styles/CommonStyles';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

function LessonListItemArchive(props: { lesson: Lesson }) {
  const { lesson } = props;
  const router = useRouter();

  const formattedDate = format(new Date(lesson.date_start), 'dd.MM.yyyy', { locale: ru });
  const formattedTimeStart = format(new Date(lesson.date_start), 'HH:mm', { locale: ru });
  const formattedTimeEnd = format(new Date(lesson.date_end), 'HH:mm', { locale: ru });

  const status: 'canceled' | 'conducted' | 'confirmed' | 'awaitingConfirmation' =
    lesson.isCancelled
      ? 'canceled'
      : lesson.isConducted
      ? 'conducted'
      : lesson.isConfirmed
      ? 'confirmed'
      : 'awaitingConfirmation';

  const getStatusIcon = (status: 'canceled' | 'conducted' | 'confirmed' | 'awaitingConfirmation') => {
    switch (status) {
      case 'canceled':
        return <AntDesign name="closecircleo" size={22} color={Colors.deepGrey} />;
      case 'conducted':
        return <MaterialIcons name="paid" size={28} color={Colors.deepGrey} />;
      case 'confirmed':
        return <AntDesign name="checkcircle" size={22} color={Colors.deepGrey} />;
      case 'awaitingConfirmation':
        return <Ionicons name="time" size={26} color={Colors.deepGrey} />;
      default:
        return null;
    }
  };

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
      <View style={styles.subjectContainer}>
        <Text style={styles.subject}>{lesson.subject}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      <PersonBadge name={lesson.student.user.last_name + ' ' + lesson.student.user.first_name} />
      <View style={styles.lessonDetails}>
        <Text style={styles.dates}>
          {formattedTimeStart} - {formattedTimeEnd}
        </Text>
        <View style={styles.statusContainer}>
          <View style={styles.statusIcon}>
            {getStatusIcon(status)}
          </View>
          <Text style={commonStyles.priceLabel}>
            {lesson.price ?? 0} {words.currency}
          </Text>
        </View>
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
  subjectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  date: {
    paddingTop: 3,
    color: Colors.mediumGrey,
    fontSize: Typography.fontSizes.m,
    fontWeight: '500',
  },
  lessonDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  statusIcon: {
    marginRight: 8,
  }
});

export default LessonListItemArchive;
