import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '@/styles/Colors';
import commonStyles from '@/styles/CommonStyles';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { AntDesign } from '@expo/vector-icons'; 

interface TimeRangePickerComponentProps {
  onDateTimeChange: (date: Date, startTime: Date, endTime: Date, duration: number) => void;
}

const roundToNextHour = (date: Date, addMinutes = 0): Date => {
  const newDate = new Date(date);
  newDate.setMinutes(addMinutes, 0, 0); 
  newDate.setHours(newDate.getHours() + 1);

  return newDate;
};

export default function TimeRangePickerComponent({
  onDateTimeChange,
}: TimeRangePickerComponentProps) {
  const addMinutes = 60;
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(roundToNextHour(new Date()));
  const [endTime, setEndTime] = useState(roundToNextHour(new Date(), addMinutes));
  const [showPicker, setShowPicker] = useState<'date' | 'startTime' | 'endTime' | null>(null);
  const [duration, setDuration] = useState(addMinutes); 

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
      onDateTimeChange(selectedDate, newStartTime, newEndTime, duration);
    } else if (showPicker === 'startTime') {
      const newStartTime = mergeDateAndTime(date, selectedDate);
      const newEndTime = new Date(newStartTime.getTime() + duration * 60000);
      setStartTime(newStartTime);
      setEndTime(newEndTime);
      onDateTimeChange(date, newStartTime, newEndTime, duration);
    } else if (showPicker === 'endTime') {
      const newEndTime = mergeDateAndTime(date, selectedDate);
      const newDuration = Math.max(0, (newEndTime.getTime() - startTime.getTime()) / 60000);
      setEndTime(newEndTime);
      setDuration(newDuration);
      onDateTimeChange(date, startTime, newEndTime, newDuration);
    }
  };

  const handleDurationChange = (increment: boolean) => {
    setDuration((prevDuration) => {
      const newDuration = increment ? prevDuration + 30 : prevDuration - 30;
      const validDuration = Math.max(30, newDuration);
      const newEndTime = new Date(startTime.getTime() + validDuration * 60000); 
      setEndTime(newEndTime);
      onDateTimeChange(date, startTime, newEndTime, validDuration);
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
        <Text style={[commonStyles.label, styles.label, styles.durationLabel]}>{`${duration} мин`}</Text>
        <TouchableOpacity onPress={() => handleDurationChange(true)}>
          <AntDesign name="plus" size={36} color={Colors.deepGrey} />
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
    backgroundColor: Colors.paleGrey,
    borderRadius: 16,
  },
  label: {
    color: Colors.deepGrey,
  },
  monthInput: {
    display: 'flex'
  },
  monthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    fontSize: 20,
    // paddingVertical: 4,
    // color: Colors.skyBlue,
    paddingHorizontal: 16,
    borderColor: Colors.deepGrey,
    width: 220,
    // borderRadius: 9,
    borderWidth: 3,
    textAlign: 'center',
    flexShrink: 1,
    textTransform: 'uppercase',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  timeLabel: {
    fontSize: 20,
    borderBottomWidth: 3,
    borderBottomColor: Colors.deepGrey
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
    fontSize: 18,
    color: Colors.deepGrey,
    width: 120,
    textAlign: 'center',
  },
});
