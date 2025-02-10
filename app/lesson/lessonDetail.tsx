import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView } from 'react-native';
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
import { getLessonService } from '@/services/lessonService';

export default function LessonDetailScreen() {
  const { lesson } = useLocalSearchParams();
  const lessonString = Array.isArray(lesson) ? lesson[0] : lesson;
  const parsedLesson: Lesson = JSON.parse(lessonString);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [lessonData, setLessonData] = useState<Lesson>(parsedLesson);
  const [refreshing, setRefreshing] = useState(false);

  const formattedDate = format(new Date(parsedLesson.date_start), 'dd.MM.yyyy', { locale: ru });
  const formattedTimeStart = format(new Date(parsedLesson.date_start), 'HH:mm', { locale: ru });
  const formattedTimeEnd = format(new Date(parsedLesson.date_end), 'HH:mm', { locale: ru });

  const subjectColors = [
      Colors.subjectColor0,
      Colors.subjectColor1,
      Colors.subjectColor2,
      Colors.subjectColor3,
      Colors.subjectColor4,
      Colors.subjectColor5,
      Colors.subjectColor6,
      Colors.subjectColor7,
      Colors.subjectColor8,
    ];
  
  const color =
    parsedLesson.subject.colorId && parsedLesson.subject.colorId < 10
      ? subjectColors[parsedLesson.subject.colorId - 1]
      : Colors.subjectColor0;

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

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const updatedLesson = await getLessonService(parsedLesson.id); 
      setLessonData(updatedLesson); 
    } catch (error) {
      console.error('Error refreshing lesson details:', error.message);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.deepGrey]} />
        }
      >
        <View style={styles.lessonDetailWrapper}>
          <View style={[styles.lessonHeader, {borderLeftColor: color}]}>
            <Text style={styles.lessonSubjectText}>{lessonData?.subject.title}</Text>
            <Text style={styles.lessonSubjectText}>{lessonData?.price} {words.currency}</Text>
            <Text style={styles.lessonTimeText}>
              {`${format(new Date(lessonData?.date_start || ''), 'd MMMM', { locale: ru })}`} {formattedTimeStart} - {formattedTimeEnd}
            </Text>
            {isTutor ? (
              <PersonBadge name={`${words.learner}: ${lessonData?.student.user.first_name} ${lessonData?.student.user.last_name}`} />
            ) : (
              <PersonBadge name={`${words.tutor}: ${lessonData?.tutor.user.first_name} ${lessonData?.tutor.user.last_name}`} />
            )}
          </View>
          {lessonData?.notes ? (
            <View style={styles.lessonDetailsSection}>
              <Text style={[commonStyles.label, styles.notesLabel]}>
                {words.notes + ':'}
              </Text>
              <Text style={commonStyles.label}>
                {lessonData?.notes}
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
      <View style={styles.actionButtonWrapper}>
        <LessonDetailStatusBar lesson={lessonData} profile={profile} />
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
  scrollView: {
    flex: 1,
  },
  lessonDetailWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
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
    borderLeftWidth: 10,
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
  },
});
