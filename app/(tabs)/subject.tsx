import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { getSubjectListService } from '@/services/lessonService';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import { Typography } from '@/styles/Typography';
import SubjectListItem from '@/components/Subject/subjectListItem';
import { Subject } from '@/models/models';
import { Text } from 'react-native';

export default function SubjectScreen() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await getSubjectListService();
      setSubjects(response || []);
    } catch (error: any) {
      Alert.alert(words.error, error.message || words.error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchSubjects();
    } catch (error: any) {
      Alert.alert(words.error, error.message || words.error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.emptyContainer}>
        <Text>
          <ActivityIndicator size="large" color={Colors.deepGrey} />;
        </Text>
      </View>
    )
  }

  return (
    <FlatList
      data={subjects}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <SubjectListItem subject={item} />}
      ListEmptyComponent={
        !loading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{words.noSubjectsAvailable}</Text>
          </View>
        ) : null
      }
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
    backgroundColor: Colors.paleGrey,
    flexGrow: 1,
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