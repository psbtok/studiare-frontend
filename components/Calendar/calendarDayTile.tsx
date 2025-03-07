import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/styles/Colors';
import { Lesson } from '@/models/models';
import { Typography } from '@/styles/Typography';
import CalendarLessonListModal from './calendarLessonListModal';
import { subjectColors } from '@/styles/Colors';
import { responsiveHeight } from 'react-native-responsive-dimensions';

interface DayTileProps {
  dayNumber: number;
  isToday: boolean;
  lessons: Lesson[];
}

const CalendarDayTile = ({ dayNumber, isToday, lessons }: DayTileProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const maxLines = 2;
  const totalLessons = lessons.length;
  const additionalLessons = Math.max(0, totalLessons - maxLines);

  const renderLines = () => {
    return lessons.slice(0, maxLines).map((lesson, index) => {
      const color = subjectColors[lesson.subject.colorId - 1] ?? subjectColors[0];
      return <View key={index} style={[styles.line, { backgroundColor: color }]} />;
    });
  };

  return (
    <TouchableOpacity
      onPress={() => setModalVisible(true)}
      style={[styles.dayTile, isToday ? styles.todayTile : null]}
    >
      <Text style={[styles.dayText, isToday ? styles.todayText : null]}>
        {dayNumber}
      </Text>

      {renderLines()}

      {additionalLessons > 0 && (
        <Text style={styles.additionalLessonsText}>+{additionalLessons}</Text>
      )}

      <CalendarLessonListModal
        visible={modalVisible}
        lessons={lessons}
        onClose={() => {setModalVisible(false)}}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dayTile: {
    flex: 1,
    height: responsiveHeight(9),
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
  line: {
    width: '100%',
    height: 2,
    marginTop: 4,
  },
  additionalLessonsText: {
    fontSize: 14,
    color: Colors.mediumGrey,
    marginTop: 2,
    width: '100%',
    textAlign: 'center'
  },
});

export default CalendarDayTile;