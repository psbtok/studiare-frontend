import React, { useEffect, useMemo, useState } from 'react';
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
import LessonDetailActions from '@/components/Lesson/lessonDetailActions';
import { subjectColors } from '@/styles/Colors';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function LessonDetailScreen() {
  const { lesson } = useLocalSearchParams();
  const lessonString = Array.isArray(lesson) ? lesson[0] : lesson;
  const parsedLesson: Lesson = JSON.parse(lessonString);

  const [profile, setProfile] = useState<Profile | any>({'user' : {'id': 0}});
  const [lessonData, setLessonData] = useState<Lesson>(parsedLesson);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); 
  const [isTutor, setIsTutor] = useState(true);
  const updatedLesson = useSelector((state: RootState) => state.app.updatedLesson);

  const formattedTimeStart = useMemo(() => {
    return format(new Date(lessonData.date_start), 'HH:mm', { locale: ru });
  }, [lessonData.date_start]);
  
  const formattedTimeEnd = useMemo(() => {
    return format(new Date(lessonData.date_end), 'HH:mm', { locale: ru });
  }, [lessonData.date_end]);

  const color =
    parsedLesson.subject.colorId && parsedLesson.subject.colorId < 10
      ? subjectColors[parsedLesson.subject.colorId - 1]
      : subjectColors[0];

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

  useEffect(() => {
      if (updatedLesson?.id === lessonData.id) {
        setLessonData(updatedLesson)
        setRefreshKey(prevKey => prevKey + 1)
      }
    }, [updatedLesson]);

  useEffect(() => {
    if (profile && parsedLesson) {
      setIsTutor(parsedLesson.tutor?.tutor && profile?.tutor?.id && profile.tutor.id === parsedLesson.tutor.tutor.id);
    }
  }, [profile, parsedLesson]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const refreshedLesson = await getLessonService(parsedLesson.id); 
      setLessonData(refreshedLesson); 
      console.log('refreshed')
      setRefreshKey(prevKey => prevKey + 1); 
    } catch (error: {message: string}) {
      console.error('Error refreshing lesson details:', error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const handleActionDone = async (refreshedLesson: Lesson) => {
    setLessonData(refreshedLesson); 
    setRefreshKey(prevKey => prevKey + 1);
  }

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
              lessonData.participants.length > 1 ? (
                <PersonBadge name={words.groupLesson} />
              ) : (
                <PersonBadge
                  name={`${words.learner}: ${lessonData.participants[0]?.profile?.user?.first_name || ''} ${lessonData.participants[0]?.profile?.user?.last_name || ''}`}
                />
              )
            ) : (
              <PersonBadge
                name={`${words.tutor}: ${lessonData?.tutor?.user?.first_name || ''} ${lessonData?.tutor?.user?.last_name || ''}`}
              />
            )}
          </View>
          {lessonData?.notes ? (
            <View style={styles.lessonDetailsSection}>
              <Text style={[commonStyles.label, {marginBottom: 2}]}>
                {words.notes + ': '}
                {lessonData?.notes}
              </Text>
              {lessonData.tutor.tutor?.paymentMethod && (
                <Text style={commonStyles.label}>
                  {words.paymentMethod + ':'} {lessonData.tutor.tutor?.paymentMethod}
                </Text>
              )}
            </View>
          ) : null}
        </View>
        <LessonDetailStatusBar key={refreshKey} lesson={lessonData} profile={profile} /> 
      </ScrollView>
      <LessonDetailActions key={refreshKey} lesson={lessonData} profile={profile} setLesson={handleActionDone} /> 
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
    paddingVertical: 8,
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
    marginTop: 4,
    marginBottom: 8,
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
});
