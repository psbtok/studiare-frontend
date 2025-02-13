import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '@/styles/Colors';
import commonStyles from '@/styles/CommonStyles';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { AntDesign } from '@expo/vector-icons'; 
import { Typography } from '@/styles/Typography';

interface TimeRangePickerComponentProps {
  onDateTimeChange: (date: Date, startTime: Date, endTime: Date, duration: number) => void;
  initialStartTime?: Date;
  initialEndTime?: Date;
}

const adjustForTimezone = (date: Date): Date => {
  const timezoneOffset = date.getTimezoneOffset(); 
  const adjustedDate = new Date(date.getTime() + timezoneOffset * 60000); 
  return adjustedDate;
};

const roundToNextHour = (date: Date, addMinutes = 0): Date => {
  const newDate = new Date(date);
  newDate.setMinutes(addMinutes, 0, 0);
  newDate.setHours(newDate.getHours() + 1);
  return newDate;
};

export default function TimeRangePickerComponent({
  onDateTimeChange,
  initialStartTime,
  initialEndTime,
}: TimeRangePickerComponentProps) {
  const defaultStartTime = roundToNextHour(new Date());
  const defaultEndTime = roundToNextHour(new Date(), 60);

  const [date, setDate] = useState(new Date(initialStartTime ?? defaultStartTime));
  const [startTime, setStartTime] = useState(initialStartTime || defaultStartTime);
  const [endTime, setEndTime] = useState(initialEndTime || defaultEndTime);
  
  const [showPicker, setShowPicker] = useState<'date' | 'startTime' | 'endTime' | null>(null);
  const [duration, setDuration] = useState(
    initialEndTime && initialStartTime
      ? (initialEndTime.getTime() - initialStartTime.getTime()) / 60000
      : (defaultEndTime.getTime() - defaultStartTime.getTime()) / 60000
  );

  useEffect(() => {
    const adjustedStartTime = adjustForTimezone(startTime);
    const adjustedEndTime = adjustForTimezone(endTime);
    const adjustedDate = adjustForTimezone(date);
        
    onDateTimeChange(adjustedDate, adjustedStartTime, adjustedEndTime, duration);
  }, [date, startTime, endTime, duration]);

  const mergeDateAndTime = (baseDate: Date, time: Date): Date => {
    const mergedDate = new Date(baseDate);
    mergedDate.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return mergedDate;
  };

  const handlePickerChange = (_: any, selectedDate?: Date) => {
    setShowPicker(null);
    if (!selectedDate) return;

    if (showPicker === 'date') {
      setDate(selectedDate);
      const newStartTime = mergeDateAndTime(selectedDate, startTime);
      const newEndTime = mergeDateAndTime(selectedDate, endTime);
      setStartTime(newStartTime);
      setEndTime(newEndTime);
      onDateTimeChange(selectedDate, adjustForTimezone(newStartTime), adjustForTimezone(newEndTime), duration);
    } else if (showPicker === 'startTime') {
      const newStartTime = mergeDateAndTime(date, selectedDate);
      const newEndTime = new Date(newStartTime.getTime() + duration * 60000);
      setStartTime(newStartTime);
      setEndTime(newEndTime);
      onDateTimeChange(date, adjustForTimezone(newStartTime), adjustForTimezone(newEndTime), duration);
    } else if (showPicker === 'endTime') {
      const newEndTime = mergeDateAndTime(date, selectedDate);
      const newDuration = Math.max(0, (newEndTime.getTime() - startTime.getTime()) / 60000);
      setEndTime(newEndTime);
      setDuration(newDuration);
      onDateTimeChange(date, adjustForTimezone(startTime), adjustForTimezone(newEndTime), newDuration);
    }
  };

  const handleDurationChange = (increment: boolean) => {
    setDuration((prevDuration) => {
      const newDuration = increment ? prevDuration + 30 : prevDuration - 30;
      const validDuration = Math.max(30, newDuration);
      const newEndTime = new Date(startTime.getTime() + validDuration * 60000);
      setEndTime(newEndTime);
      onDateTimeChange(date, adjustForTimezone(startTime), adjustForTimezone(newEndTime), validDuration);
      return validDuration;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.monthContainer}>
        <TouchableOpacity style={styles.timeInput} onPress={() => setShowPicker('date')}>
          <Text style={[commonStyles.label, styles.label, styles.monthLabel]}>
            {`${format(date, 'd MMMM', { locale: ru })}`}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timeContainer}>
        <TouchableOpacity style={styles.timeInput} onPress={() => setShowPicker('startTime')}>
          <Text style={[commonStyles.label, styles.label, styles.timeLabel]}>
            {`${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`}
          </Text>
        </TouchableOpacity>
        <Text style={[commonStyles.label, styles.label]}>-</Text>
        <TouchableOpacity style={styles.timeInput} onPress={() => setShowPicker('endTime')}>
          <Text style={[commonStyles.label, styles.label, styles.timeLabel]}>
            {`${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.durationContainer}>
        <TouchableOpacity onPress={() => handleDurationChange(false)}>
          <AntDesign name="minus" size={36} color={Colors.deepGrey} />
        </TouchableOpacity>
        <Text style={[commonStyles.label, styles.label, styles.durationLabel]}>{`${parseInt(duration)} мин`}</Text>
        <TouchableOpacity onPress={() => handleDurationChange(true)}>
          <AntDesign name="plus" size={36} color={Colors.deepGrey} />
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={showPicker === 'date' ? date : showPicker === 'startTime' ? startTime : endTime}
          mode={showPicker === 'date' ? 'date' : 'time'}
          is24Hour={true}
          display="default"
          onChange={handlePickerChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.paleGrey,
    borderRadius: 16,
  },
  label: {
    color: Colors.deepGrey,
  },
  monthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    fontSize: Typography.fontSizes.l,
    paddingHorizontal: 16,
    borderColor: Colors.deepGrey,
    width: 220,
    borderWidth: 3,
    textAlign: 'center',
    flexShrink: 1,
    textTransform: 'uppercase',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeLabel: {
    fontSize: Typography.fontSizes.l,
    borderBottomWidth: 2.25,
    fontWeight: '500',
    borderBottomColor: Colors.deepGrey,
  },
  timeInput: {
    paddingHorizontal: 16,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  durationLabel: {
    fontSize: Typography.fontSizes.m,
    color: Colors.deepGrey,
    width: 120,
    textAlign: 'center',
    fontWeight: '500',
  },
});
