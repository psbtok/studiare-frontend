import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { getLessonListService } from '@/services/lessonService';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import LessonListItemArchive from './lessonListItemArchive';
import { Lesson } from '@/models/models';
import { Typography } from '@/styles/Typography';

export default function LessonListArchive() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const response = await getLessonListService({orderBy: '-date_start'});
      setLessons(response.results || []);
    } catch (error: any) {
      Alert.alert(words.error, error.message || words.error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      fetchLessons();
    } catch (error: any) {
      Alert.alert(words.error, error.message || words.error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  if (loading && !refreshing) {
    return <ActivityIndicator size="large" color={Colors.alertRed} />;
  }

  if (!lessons.length && !loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{words.noLessonsAvailable}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={lessons}
      keyExtractor={(lesson) => lesson.id.toString()}
      renderItem={({ item }) => <LessonListItemArchive lesson={item} />}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.deepGrey]} />
      }
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
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
