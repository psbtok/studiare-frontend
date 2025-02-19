import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '@/styles/Colors';
import commonStyles from '@/styles/CommonStyles';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Typography } from '@/styles/Typography';

interface DatePickerProps {
  onDateChange: (date: Date) => void;
  defaultDate?: Date; 
  resetDate: boolean;
}

export default function DatePicker({ onDateChange, defaultDate, resetDate }: DatePickerProps) {
  const [date, setDate] = useState(defaultDate ?? new Date());
  const [showPicker, setShowPicker] = useState(false);
  
  useEffect(() => {
    if (resetDate) {
      setDate(defaultDate ?? new Date());
    }
  }, [resetDate, defaultDate]);

  const handlePickerChange = (_: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      onDateChange(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateInput}>
        <Text style={[commonStyles.label, styles.dateLabel]}>
          {format(date, 'd MMMM yyyy', { locale: ru })}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          testID="datePicker"
          value={date}
          mode="date"
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
    paddingLeft: 16,
    color: Colors.mediumGrey,
    borderColor: Colors.mediumGrey,
    backgroundColor: Colors.lightGrey,
    borderWidth: 2,
    height: 52,
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  dateInput: {
    width: '100%',
    height: 52,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  dateLabel: {
    fontSize: Typography.fontSizes.s,
    color: Colors.mediumGrey,
    fontWeight: '400',
    textAlign: 'left',
  },
});
