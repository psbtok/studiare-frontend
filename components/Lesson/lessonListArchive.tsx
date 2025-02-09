import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { getLessonListService } from '@/services/lessonService';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import LessonListItemArchive from './lessonListItemArchive';
import { Lesson, Profile } from '@/models/models';
import { Typography } from '@/styles/Typography';
import { format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LessonListArchive() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [parsedProfile, setParsedProfile] = useState<Profile | object>({})

  const fetchLessons = async (currentOffset: number = 0, isRefresh=false) => {
    if ((loading || !hasMore) && !isRefresh) return;

    setLoading(true);
    try {
      const today = format(new Date(), 'yyyy-MM-dd 00:00:00');
      const response = await getLessonListService({
        date_start_to: today,
        orderBy: '-date_start',
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
      Alert.alert(words.error, error.message || words.error);
    } finally {
      setLoading(false);
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

  const handleScroll = (e: any) => {
    const contentHeight = e.nativeEvent.contentSize.height;
    const contentOffsetY = e.nativeEvent.contentOffset.y;
    const layoutMeasurementHeight = e.nativeEvent.layoutMeasurement.height;

    if (contentHeight - contentOffsetY - layoutMeasurementHeight < 100 && hasMore && !loading) {
      setOffset((prevOffset) => {
        const newOffset = prevOffset + 10;
        fetchLessons(newOffset);
        return newOffset;
      });
    }
  };

  useEffect(() => {
    if (offset === 0) {
      fetchLessons(0);
    }
  }, [offset]);

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
        <ActivityIndicator size="large" color={Colors.deepGrey} />;
      </View>
    )
  }

  return (
    <FlatList
      data={lessons}
      keyExtractor={(lesson) => lesson.id.toString()}
      renderItem={({ item }) => <LessonListItemArchive 
        lesson={item} 
        isTutor={
          item.tutor?.tutor && parsedProfile?.tutor?.id && parsedProfile.tutor.id === item.tutor.tutor.id
        } 
    />}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.deepGrey]} />
      }
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      onScroll={handleScroll}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyContainer: {
    backgroundColor: Colors.paleGrey,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Typography.fontSizes.m,
    color: Colors.mediumGrey,
  },
});
