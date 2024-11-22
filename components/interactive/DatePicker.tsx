import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '@/styles/Colors';
import commonStyles from '@/styles/CommonStyles';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface DateTimePickerComponentProps {
  onDateTimeChange: (date: Date, startTime: Date, endTime: Date, duration: number) => void;
}

const roundToNextHour = (date: Date, addMinutes=0): Date => {
    const newDate = new Date(date);
    newDate.setMinutes(addMinutes, 0, 0); // Set minutes, seconds, and milliseconds to 0
    newDate.setHours(newDate.getHours() + 1);
  
    return newDate;
};

export default function DateTimePickerComponent({
  onDateTimeChange,
}: DateTimePickerComponentProps) {
  const addMinutes = 30;
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(roundToNextHour(new Date()));
  const [endTime, setEndTime] = useState(roundToNextHour(new Date(), addMinutes));
  const [showPicker, setShowPicker] = useState<'date' | 'startTime' | 'endTime' | null>(null);
  const [duration, setDuration] = useState(addMinutes); // Duration in minutes

  const handlePickerChange = (_: any, selectedDate?: Date) => {
    setShowPicker(null); // Close picker
    if (!selectedDate) return;

    let newStartTime = startTime;
    let newEndTime = endTime;

    if (showPicker === 'date') {
      setDate(selectedDate);
      newStartTime = new Date(selectedDate.setHours(startTime.getHours(), startTime.getMinutes()));
      newEndTime = new Date(selectedDate.setHours(endTime.getHours(), endTime.getMinutes()));
    } else if (showPicker === 'startTime') {
      newStartTime = selectedDate;
      newEndTime = new Date(selectedDate.getTime() + duration * 60000); // Update end time based on duration
    } else if (showPicker === 'endTime') {
      newEndTime = selectedDate;
    }

    const newDuration = Math.max(0, (newEndTime.getTime() - newStartTime.getTime()) / 60000); // Calculate duration in minutes
    setStartTime(newStartTime);
    setEndTime(newEndTime);
    setDuration(newDuration);
    onDateTimeChange(date, newStartTime, newEndTime, newDuration);
  };

  const handleDurationChange = (increment: boolean) => {
    setDuration((prevDuration) => {
      const newDuration = increment ? prevDuration + 30 : prevDuration - 30;
      const validDuration = Math.max(30, newDuration); // Ensure duration doesn't go below 30 minutes
      const newEndTime = new Date(startTime.getTime() + validDuration * 60000); // Update end time based on new duration
      setEndTime(newEndTime);
      onDateTimeChange(date, startTime, newEndTime, validDuration);
      return validDuration;
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShowPicker('date')}>
        <Text style={[commonStyles.label, styles.label, styles.monthLabel]}>
            {`${format(date, 'd MMMM', { locale: ru })}`}
        </Text>
      </TouchableOpacity>

      <View style={styles.timeContainer}>
        <TouchableOpacity style={styles.timeInput} onPress={() => setShowPicker('startTime')}>
          <Text style={[commonStyles.label, styles.label]}>
            {`${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false})}`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.timeInput} onPress={() => setShowPicker('endTime')}>
          <Text style={[commonStyles.label, styles.label]}>
            {`${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false})}`}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.durationContainer}>
        <TouchableOpacity onPress={() => handleDurationChange(false)}>
          <Text style={[commonStyles.label, styles.label]}>-</Text>
        </TouchableOpacity>
        <Text style={styles.durationText}>{`${duration} мин`}</Text>
        <TouchableOpacity onPress={() => handleDurationChange(true)}>
          <Text style={[commonStyles.label, styles.label]}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Date/Time Picker Modal */}
      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
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
    padding: 16,
    backgroundColor: Colors.deepGrey,
    borderRadius: 16,
    marginVertical: 10,
  },
  label: {
    color: Colors.paleGrey
  },
  monthLabel: {
    fontSize: 24,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderColor: Colors.paleGrey,
    borderRadius: 12,
    borderWidth: 3,
    width: 'auto',
    flexShrink: 1,
    textTransform: 'uppercase'
  },
  timeContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    width: 120,
    paddingHorizontal: 10,
  },
  durationContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  durationText: {
    fontSize: 16,
    color: Colors.paleGrey,
    marginHorizontal: 10,
  },
});
