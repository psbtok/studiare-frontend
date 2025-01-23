import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { getLessonListService } from '@/services/lessonService';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import LessonListItem from './lessonListItem';
import { Lesson } from '@/models/models';
import { Typography } from '@/styles/Typography';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function LessonList() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLessons = async (filters = {}) => {
    setLoading(true);
    try {
      const today = format(new Date(), 'yyyy-MM-dd 00:00:00');
      const response = await getLessonListService({
        date_start_from: today, 
        orderBy: 'date_start', 
        ...filters 
      });
      setLessons(response.results || []);
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchLessons();
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
              <LessonListItem key={lesson.id} lesson={lesson} />
            ))}
          </View>
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{words.noLessonsAvailable}</Text>
            </View>
          ) : null // Используем null вместо false
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.deepGrey]} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  if (loading && !refreshing) {
    return <ActivityIndicator size="large" color={Colors.deepGrey} />;
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Typography.fontSizes.m,
    color: Colors.mediumGrey,
  },
});
