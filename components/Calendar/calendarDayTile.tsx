import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Colors } from '@/styles/Colors';
import { Lesson } from '@/models/models';
import { Typography } from '@/styles/Typography';
import CalendarLessonListModal from './calendarLessonListModal';
interface DayTileProps {
  dayNumber: number;
  isToday: boolean;
  lessons: Lesson[];
}

const CalendarDayTile = ({ dayNumber, isToday, lessons }: DayTileProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const circleColors = {
    canceled: Colors.alertRed,
    conducted: Colors.successGreen,
    confirmed: Colors.mediumGrey,
    awaitingConfirmation: Colors.stoneGrey,
  };

  const hasCanceled = lessons.some((lesson) => lesson.isCancelled);
  const hasConducted = lessons.some((lesson) => lesson.isConducted);
  const hasConfirmed = lessons.some((lesson) => lesson.isConfirmed);
  const hasAwaitingConfirmation = lessons.some(
    (lesson) => !lesson.isConfirmed && !lesson.isConducted && !lesson.isCancelled
  );

  const renderCircle = (status: boolean, color: string) => {
    if (status) {
      return <View style={[styles.circle, { backgroundColor: color }]} />;
    } else {
      return <View style={styles.emptyCircle} />;
    }
  };

  return (
    <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.dayTile, isToday ? styles.todayTile : null]}>
      <Text style={[styles.dayText, isToday ? styles.todayText : null]}>
        {dayNumber}
      </Text>

      <View style={styles.circleContainer}>
        {renderCircle(hasCanceled, circleColors.canceled)}
        {renderCircle(hasAwaitingConfirmation, circleColors.awaitingConfirmation)}
      </View>
      <View style={styles.circleContainer}>
        {renderCircle(hasConfirmed, circleColors.confirmed)}
        {renderCircle(hasConducted, circleColors.conducted)}
      </View>

      <CalendarLessonListModal 
        visible={modalVisible} 
        lessons={lessons} 
        onClose={() => setModalVisible(false)} 
      />
    </TouchableOpacity>    
  );
};

const styles = StyleSheet.create({
  dayTile: {
    flex: 1,
    height: 80,
    backgroundColor: Colors.lightGrey,
    margin: 4,
    flexDirection: 'column',
    paddingHorizontal: 4,
    alignItems: 'flex-start',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.lightGrey,
    justifyContent: 'flex-start',
  },
  todayTile: {
    borderColor: Colors.skyBlue,
  },
  dayText: {
    color: Colors.deepGrey,
    fontWeight: '500',
    fontSize: Typography.fontSizes.s,
  },
  todayText: {
    color: Colors.skyBlue,
    fontWeight: 'bold',
  },
  circleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 4,
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  emptyCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.paleGrey,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalText: {
    fontSize: Typography.fontSizes.l,
    color: Colors.deepGrey,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
    padding: 5,
    backgroundColor: Colors.skyBlue,
    borderRadius: 4,
  },
  closeButtonText: {
    color: Colors.paleGrey,
  },
});

export default CalendarDayTile;
