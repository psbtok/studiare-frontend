import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/styles/Colors';
import { Typography } from '@/styles/Typography';
import { useLocalSearchParams } from 'expo-router';
import { Lesson, Profile } from '@/models/models';
import words from '@/locales/ru';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import PersonBadge from '@/components/General/NonInteractive/personBadge';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfileService } from '@/services/authService';
import LessonDetailStatusBar from '@/components/Lesson/lessonDetailStatusBar';
import commonStyles from '@/styles/CommonStyles';

export default function LessonDetailScreen() {
  const { lesson } = useLocalSearchParams();
  const lessonString = Array.isArray(lesson) ? lesson[0] : lesson;
  const parsedLesson: Lesson = JSON.parse(lessonString);
  const [profile, setProfile] = useState<Profile | null>(null);

  const formattedDate = format(new Date(parsedLesson.date_start), 'dd.MM.yyyy', { locale: ru });
  const formattedTimeStart = format(new Date(parsedLesson.date_start), 'HH:mm', { locale: ru });
  const formattedTimeEnd = format(new Date(parsedLesson.date_end), 'HH:mm', { locale: ru });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('profile');
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        } else {
          const fetchedProfile = await getProfileService();
          setProfile(fetchedProfile);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const isTutor = parsedLesson.tutor?.tutor && profile?.tutor?.id && profile.tutor.id === parsedLesson.tutor.tutor.id;

  return (
    <View style={styles.container}>
      <View style={styles.lessonDetailWrapper}>
        <View style={styles.lessonHeader}>
          <Text style={styles.lessonSubjectText}>{parsedLesson.subject}</Text>
          <Text style={styles.lessonSubjectText}>{parsedLesson.price} {words.currency}</Text>
          <Text style={styles.lessonTimeText}>
            {`${format(new Date(parsedLesson.date_start), 'd MMMM', { locale: ru })}`} {formattedTimeStart} - {formattedTimeEnd}
          </Text>
          {isTutor ? (
            <PersonBadge name={`${words.learner}: ${parsedLesson.student.user.first_name} ${parsedLesson.student.user.last_name}`} />
          ) : (
            <PersonBadge name={`${words.tutor}: ${parsedLesson.tutor.user.first_name} ${parsedLesson.tutor.user.last_name}`} />
          )}
        </View>
        { parsedLesson.notes ? 
          <View style={styles.lessonDetailsSection}>
            <Text style={[commonStyles.label, styles.notesLabel]}>
              {words.notes + ':'}
            </Text>
            <Text style={commonStyles.label}>
              {parsedLesson.notes}
            </Text>
          </View>
          : ''
        }
      </View>
      <View style={styles.actionButtonWrapper}>
        <LessonDetailStatusBar lesson={parsedLesson} profile={profile} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.paleGrey,
  },
  lessonDetailWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  actionButtonWrapper: {
  },
  lessonDetailsSection: {
    paddingVertical: 16,
    flexDirection: 'column',
    marginTop: 12,
    backgroundColor: Colors.lightGrey,
    padding: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
},
  lessonHeader: {
    paddingVertical: 12,
    paddingHorizontal: 21,
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: Colors.deepGrey,
    borderRadius: 16,
  },
  lessonTimeText: {
    marginTop: 12,
    marginBottom: 16,
    fontSize: Typography.fontSizes.m,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: Colors.lightGrey,
  },
  lessonSubjectText: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: 'bold',
    color: Colors.paleGrey,
  },
  notesLabel: {
    marginBottom: 0,
  }
});
