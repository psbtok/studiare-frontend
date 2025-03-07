import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Lesson } from '@/models/models';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import { Typography } from '@/styles/Typography';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz'; 
import { ru } from 'date-fns/locale';
import PersonBadge from '../General/NonInteractive/personBadge';
import commonStyles from '@/styles/CommonStyles';
import AntDesign from '@expo/vector-icons/AntDesign';
import { subjectColors } from '@/styles/Colors';

function LessonListItem(props: { 
  lesson: Lesson, 
  isTutor?: boolean, 
  onLessonPress?: (lesson: Lesson) => void 
}) {
  const { lesson, isTutor, onLessonPress } = props;
  const router = useRouter();

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; 

  const formattedTimeStart = format(toZonedTime(new Date(lesson.date_start), userTimeZone), 'HH:mm', { locale: ru });
  const formattedTimeEnd = format(toZonedTime(new Date(lesson.date_end), userTimeZone), 'HH:mm', { locale: ru });
    
  const color =
    lesson.subject.colorId && lesson.subject.colorId < 10
      ? subjectColors[lesson.subject.colorId - 1]
      : Colors.subjectColor0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'cancelled':
        return <AntDesign name="closecircle" size={22} color={Colors.deepGrey} />;
      case 'conducted':
        return <AntDesign name="checkcircle" size={22} color={Colors.deepGrey} />;
      case 'confirmed':
        return <AntDesign name="checkcircleo" size={22} color={Colors.deepGrey} />;
      case 'awaiting_confirmation':
        return <AntDesign name="clockcircleo" size={22} color={Colors.deepGrey} />;
      default:
        return null;
    }
  };

  const handlePress = () => {
    if (onLessonPress) {
      onLessonPress(lesson);
    }

    router.push({
      pathname: '/lesson/lessonDetail',
      params: { lesson: JSON.stringify(lesson) }
    });
  };

  return (
    <TouchableOpacity
      style={[styles.lessonItem, { borderLeftColor: color }]}
      onPress={handlePress}
    >
      <Text style={styles.subject}>{lesson.subject.title}</Text>
      {isTutor ? (
        lesson.participants.length > 1 ? (
          <PersonBadge name={words.groupLesson} />
        ) : (
          <PersonBadge
            name={`${words.learner}: ${lesson.participants[0]?.profile?.user?.first_name || ''} ${lesson.participants[0]?.profile?.user?.last_name || ''}`}
          />
        )
      ) : (
        <PersonBadge
          name={`${words.tutor}: ${lesson?.tutor?.user?.first_name || ''} ${lesson?.tutor?.user?.last_name || ''}`}
        />
      )}
      
      <View style={styles.lessonDetails}>
        <Text style={styles.dates}>
          {formattedTimeStart} - {formattedTimeEnd}
        </Text>
        <View style={styles.statusContainer}>
          <View style={styles.statusIcon}>
            {lesson.participants.length == 1 && 
            getStatusIcon(lesson.participants[0].status)}
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
    borderLeftWidth: 6,
    shadowColor: Colors.deepGrey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 4,
  },
  lessonDetails: {
    marginTop: 2,
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
    marginRight: 8
  }
});

export default LessonListItem;
