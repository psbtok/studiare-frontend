import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, TouchableOpacity, RefreshControl } from 'react-native';
import { Colors } from '@/styles/Colors';
import { Lesson, Profile } from '@/models/models';
import { Typography } from '@/styles/Typography';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import LessonListItem from '../Lesson/lessonListItem';
import Button from '../General/Interactive/Button';
import words from '@/locales/ru';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CalendarLessonListModalProps {
  visible: boolean;
  lessons: Lesson[];
  onClose: () => void;
}

const CalendarLessonListModal = ({ visible, lessons, onClose }: CalendarLessonListModalProps) => {
  const [refreshing, setRefreshing] = useState(false);
  const [parsedProfile, setParsedProfile] = useState<Profile | object>({})

  const groupLessonsByDate = (lessons: Lesson[]) => {
    return lessons.reduce((acc: Record<string, Lesson[]>, lesson) => {
      const date = format(new Date(lesson.date_start), 'EEEE, d MMMM yyyy', { locale: ru });
      if (!acc[date]) acc[date] = [];
      acc[date].push(lesson);
      return acc;
    }, {});
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
  
  const renderGroupedLessons = () => {
    const groupedLessons = groupLessonsByDate(lessons);
    const groupedArray = Object.entries(groupedLessons);

    return (
      <FlatList
        data={groupedArray}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => (
          <View style={styles.groupContainer}>
            <View style={styles.controls}>
              <View style={styles.dateContainer}>
                <Text style={styles.dayHeader}>{item[0].split(',')[0]}</Text>
                <Text style={styles.dateHeader}>{item[0].split(',')[1].trim()}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <Button onPress={onClose} label={words.close}  hasIcon={true} icon='close'></Button>
              </View>
            </View>
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
        ListEmptyComponent={
          <View style={styles.emptyComponent}>
            <View style={styles.emptyButtonContainer}>
                <Button onPress={onClose} label={words.close}  hasIcon={true} icon='close'></Button>
            </View>
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{words.noLessonsAvailable}</Text>
            </View>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(true)} colors={[Colors.deepGrey]} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {renderGroupedLessons()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '95%',
    height: '95%',
    backgroundColor: Colors.paleGrey,
    borderRadius: 16,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
    backgroundColor: Colors.skyBlue,
    borderRadius: 4,
  },
  closeButtonText: {
    color: Colors.paleGrey,
  },
  listContainer: {
    flexGrow: 1,
    marginTop: 16,
  },
  groupContainer: {
    marginBottom: 16,
  },
  dayHeader: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.darkBlue,
    textTransform: 'capitalize',
  },
  dateHeader: {
    fontSize: Typography.fontSizes.l,
    color: Colors.mediumGrey,
    marginBottom: 8,
  },
  emptyComponent: {
    flexDirection: 'column',
    flex: 1,
    paddingBottom: 52
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
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dateContainer: {
    flex: 1
  },
  buttonContainer: {
    width: 52
  },
  emptyButtonContainer: {
    alignSelf: 'flex-end',
    width: 52
  }
});

export default CalendarLessonListModal;