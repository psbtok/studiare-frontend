import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Alert, TouchableOpacity, RefreshControl, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/styles/Colors';
import { Typography } from '@/styles/Typography';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import CalendarEmptyTile from '@/components/Calendar/calendarBlankTile';
import CalendarDayTile from '@/components/Calendar/calendarDayTile';
import commonStyles from '@/styles/CommonStyles';
import { getLessonListService } from '@/services/lessonService';
import { Lesson } from '@/models/models';
import DateTimePicker from '@react-native-community/datetimepicker';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';

const CalendarScreen = () => {
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [daysInMonth, setDaysInMonth] = useState<number>(31);
  const [previousMonthDays, setPreviousMonthDays] = useState<number>(0);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showMonthPicker, setShowMonthPicker] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const today = new Date();
  const updatedLesson = useSelector((state: RootState) => state.app.updatedLesson);

  useEffect(() => {
    if (updatedLesson) {
      setLessons((prevLessons) => {
        const lessonIndex = prevLessons.findIndex((lesson) => lesson.id === updatedLesson.id);

        if (lessonIndex !== -1) {
          const updatedLessons = [...prevLessons];
          updatedLessons[lessonIndex] = updatedLesson;
          return updatedLessons;
        } else {
          return [updatedLesson, ...prevLessons];
        }
      });
    }
  }, [updatedLesson]);

  useEffect(() => {
    const calculateDaysInMonth = () => {
      const date = new Date(currentYear, currentMonth + 1, 0);
      setDaysInMonth(date.getDate());

      const previousMonthDate = new Date(currentYear, currentMonth, 0);
      setPreviousMonthDays(previousMonthDate.getDate());
    };

    calculateDaysInMonth();
  }, [currentMonth, currentYear]);

  useEffect(() => {
    fetchLessonsForMonth();
  }, [currentMonth, currentYear]);

  const fetchLessonsForMonth = async () => {
    setLoading(true);
    try {
      const startOfMonth = new Date(currentYear, currentMonth, 2);
      const startOfMonthUTC = format(
        new Date(startOfMonth.getTime() + today.getTimezoneOffset() * 60 * 1000),
        'yyyy-MM-dd 00:00:00'
      );

      const endOfMonth = new Date(currentYear, currentMonth + 1, 1);
      const endOfMonthUTC = format(
        new Date(endOfMonth.getTime() + today.getTimezoneOffset() * 60 * 1000),
        'yyyy-MM-dd 23:59:59'
      );

      const response = await getLessonListService({
        date_end_from: startOfMonthUTC,
        date_end_to: endOfMonthUTC,
      }, '100');
      setLessons(response.results || []);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLessonsForMonth();
    setRefreshing(false);
  };

  const getFirstDayOfMonth = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const generateCalendarTiles = () => {
    const firstDay = getFirstDayOfMonth();
    const tiles = [];

    for (let i = 0; i < firstDay; i++) {
      const previousMonthDay = previousMonthDays - firstDay + i + 1;
      tiles.push({ type: 'empty', number: previousMonthDay });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      tiles.push({ type: 'day', number: i });
    }

    return tiles;
  };

  const groupLessonsByDay = (lessons: Lesson[]) => {
    return lessons.reduce((acc: Record<number, Lesson[]>, lesson) => {
      const lessonDay = new Date(lesson.date_start).getDate();
      if (!acc[lessonDay]) acc[lessonDay] = [];
      acc[lessonDay].push(lesson);
      return acc;
    }, {});
  };

  const tiles = generateCalendarTiles();
  const lessonsGroupedByDay = groupLessonsByDay(lessons);
  let monthRow = format(new Date(currentYear, currentMonth, 1), 'LLLL yyyy', { locale: ru });
  const month = monthRow.charAt(0).toUpperCase() + monthRow.slice(1);

  const groupTilesIntoRows = (tiles: any[]) => {
    const rows = [];
    for (let i = 0; i < tiles.length; i += 7) {
      rows.push(tiles.slice(i, i + 7));
    }

    const lastRow = rows[rows.length - 1];
    const remainingCells = 7 - lastRow.length;
    for (let i = 0; i < remainingCells; i++) {
      lastRow.push({ type: 'empty', number: i + 1 });
    }

    return rows;
  };

  const rows = groupTilesIntoRows(tiles);

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleMonthPickerChange = (_: any, selectedDate?: Date) => {
    setShowMonthPicker(false);
    if (selectedDate) {
      setCurrentMonth(selectedDate.getMonth());
      setCurrentYear(selectedDate.getFullYear());
    }
  };

  const isToday = (day: number) => {
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };
  
  return (
    <ScrollView 
      style={{backgroundColor: Colors.paleGrey}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.deepGrey]} />
      }
    >
    <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handlePreviousMonth} style={styles.arrowButton}>
            <Ionicons name="arrow-back" size={28} color={Colors.deepGrey} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowMonthPicker(true)} style={styles.monthBlockContainer}>
            <Text style={[commonStyles.label, styles.monthBlock]}>{month}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextMonth} style={styles.arrowButton}>
            <Ionicons name="arrow-forward" size={28} color={Colors.deepGrey} />
          </TouchableOpacity>
        </View>

        {showMonthPicker && (
          <DateTimePicker
            testID="monthPicker"
            value={new Date(currentYear, currentMonth, 1)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleMonthPickerChange}
            minimumDate={new Date(2000, 0, 1)} 
            maximumDate={new Date(2100, 11, 31)}
          />
        )}


        <View style={styles.calendarContainer}>
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.calendarRow}>
              {row.map((tile, index) => {
                if (tile.type === 'empty') {
                  return <CalendarEmptyTile key={index} number={tile.number} />;
                }

                const dayLessons = lessonsGroupedByDay[tile.number] || [];
                return (
                  <CalendarDayTile
                    key={index}
                    dayNumber={tile.number}
                    lessons={dayLessons}
                    isToday={isToday(tile.number)} 
                  />
                );
              })}
            </View>
          ))}
        </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paleGrey,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,  
    justifyContent: 'center', 
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  monthBlockContainer: {
    paddingTop: 8,
  },
  monthBlock: {
    fontSize: Typography.fontSizes.l,
    color: Colors.deepGrey,
    marginHorizontal: 16,
  },
  arrowButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    width: '90%',
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(1),
  },
});

export default CalendarScreen;
