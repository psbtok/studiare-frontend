import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { getLessonListService } from '@/services/lessonService';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import LessonListItem from './lessonListItem';
import { Lesson, Profile } from '@/models/models';
import { Typography } from '@/styles/Typography';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LessonList() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [parsedProfile, setParsedProfile] = useState<Profile | object>({})
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchLessons = async (currentOffset: number = 0, isRefresh=false) => {
    if ((loading || !hasMore) && !isRefresh) return;
    
    setLoading(true);
    if (currentOffset) {
      setRefreshing(true)
    }

    console.log(refreshing)
    try {
      const today = new Date();
      const utcCurrentTime =format(
        new Date(today.getTime() + today.getTimezoneOffset() * 60 * 1000), 
        'yyyy-MM-dd HH:mm:00'
      ); 

      const response = await getLessonListService({
        date_end_from: utcCurrentTime, 
        orderBy: 'date_start', 
        offset: currentOffset,
        limit: 10,
      });

      if (response.results && response.results.length > 0) {
        setLessons((prevLessons) => [...prevLessons, ...response.results]);
        setHasMore(response.results.length === 10 && response.next !== null);
      } else {
        setHasMore(false);
      }
    } catch (error: any) {
    } finally {
      setLoading(false);
      setRefreshing(false)
    }
  };

  const handleScroll = (e: any) => {
    const contentHeight = e.nativeEvent.contentSize.height;
    const contentOffsetY = e.nativeEvent.contentOffset.y;
    const layoutMeasurementHeight = e.nativeEvent.layoutMeasurement.height;

    if (contentHeight - contentOffsetY - layoutMeasurementHeight < 100 && hasMore && !loading) {
      setOffset((prevOffset) => {
        const newOffset = prevOffset + 10;
        fetchLessons(newOffset, false);
        return newOffset;
      });
    }
  };


  useEffect(() => {
    const loadProfile = async () => {
      const profile = await AsyncStorage.getItem('profile');
      if (profile) {
        setParsedProfile(JSON.parse(profile));
      }
    };
    loadProfile();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setHasMore(true);
    setOffset(0);
    setLessons([]);
    try {
      await fetchLessons(0, true);
    } catch (error: any) {
      Alert.alert(words.error, error.message || words.error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const groupLessonsByDate = (lessons: Lesson[]) => {
    return lessons.reduce((acc: Record<string, Lesson[]>, lesson) => {
      const date = format(new Date(lesson.date_start), 'EEEE, d MMMM yyyy', { locale: ru });
      if (!acc[date]) acc[date] = [];
      acc[date].push(lesson);
      return acc;
    }, {});
  };

  const renderGroupedLessons = () => {
    const groupedLessons = groupLessonsByDate(lessons);
    const groupedArray = Object.entries(groupedLessons);

    return (
      <FlatList
        data={groupedArray}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => (
          <View style={styles.groupContainer}>
            <Text style={styles.dayHeader}>{item[0].split(',')[0]}</Text>
            <Text style={styles.dateHeader}>{item[0].split(',')[1].trim()}</Text>
            {item[1].map((lesson) => (
              <LessonListItem 
                key={lesson.id} 
                lesson={lesson} 
                isTutor={
                  lesson.tutor?.tutor && parsedProfile?.tutor?.id && parsedProfile.tutor.id === lesson.tutor.tutor.id
                }
              />
            ))}
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.deepGrey]} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
      />
    );
  };
  
  if (!lessons.length && !loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{words.noLessonsAvailable}</Text>
      </View>
    );
  }

  if (loading && !refreshing) {
      return (
        <View style={styles.emptyContainer}>
          <Text>
            <ActivityIndicator size="large" color={Colors.deepGrey} />
          </Text>
        </View>
      )
    }
  

  return renderGroupedLessons();
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexGrow: 1, // Важно для отображения в пустом состоянии
  },
  groupContainer: {
    marginBottom: 16,
  },
  dayHeader: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.darkBlue,
    textTransform: 'capitalize',
    letterSpacing: 0.3,
  },
  dateHeader: {
    fontSize: Typography.fontSizes.l,
    letterSpacing: 0.2,
    color: Colors.mediumGrey,
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.paleGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Typography.fontSizes.m,
    color: Colors.mediumGrey,
  },
});
