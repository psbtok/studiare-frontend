import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, SafeAreaView } from 'react-native';
import Button from '@/components/interactive/Button';
import { useRouter } from 'expo-router';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import { createLessonService } from '../services/lessonService';
import commonStyles from '@/styles/CommonStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerComponent from '@/components/interactive/DatePicker';

export default function CreateLessonScreen() {
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [studentId, setStudentId] = useState('');
  const router = useRouter();
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const onChangeStart = (_, selectedDate: any) => {
    const currentDate = selectedDate || dateStart;
    setShowStartPicker(false);
    setDateStart(currentDate);
  };

  const onChangeEnd = (_, selectedDate: any) => {
    const currentDate = selectedDate || dateEnd;
    setShowEndPicker(false);
    setDateEnd(currentDate);
  };

  const showMode = (setPickerVisibility: (value: boolean) => void, currentMode: 'date' | 'time') => {
    setPickerVisibility(true);
    setMode(currentMode);
  };

  const handleCreateLesson = async () => {
    try {
      await createLessonService(
        parseInt(studentId),
        subject,
        dateStart.toISOString(),
        dateEnd.toISOString(), // Pass date_end here
        notes
      );

      Alert.alert(
        words.success,
        words.lessonCreated,
        [
          {
            text: words.ok,
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error creating lesson:', error.message);
      Alert.alert(words.error, error.message);
    }
  };

  const handleReset = () => {
    setSubject('');
    setDateStart(new Date());
    setDateEnd(new Date());
    setDuration('');
    setNotes('');
    setStudentId('');
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={commonStyles.label}>{words.subject}</Text>
        <TextInput
          style={commonStyles.input}
          placeholder={words.enterSubject}
          placeholderTextColor={Colors.mediumGrey}
          value={subject}
          onChangeText={setSubject}
        />
        <DateTimePickerComponent
            onDateTimeChange={(date, startTime, endTime) => {
                console.log('Selected Date:', date);
                console.log('Start Time:', startTime);
                console.log('End Time:', endTime);
            }}
            />

        {/* <SafeAreaView>
          <Button onPress={() => showMode(setShowStartPicker, 'date')} label="Выберите дату начала" />
          <Button onPress={() => showMode(setShowStartPicker, 'time')} label="Выберите время начала" />
          <Text>Начало: {dateStart.toLocaleString()}</Text>
          {showStartPicker && (
            <DateTimePicker
              testID="dateTimePickerStart"
              value={dateStart}
              mode={mode}
              is24Hour={true}
              onChange={onChangeStart}
            />
          )}
        </SafeAreaView> */}

        {/* <SafeAreaView>
          <Button onPress={() => showMode(setShowEndPicker, 'date')} label="Выберите дату окончания" />
          <Button onPress={() => showMode(setShowEndPicker, 'time')} label="Выберите время окончания" />
          <Text>Окончание: {dateEnd.toLocaleString()}</Text>
          {showEndPicker && (
            <DateTimePicker
              testID="dateTimePickerEnd"
              value={dateEnd}
              mode={mode}
              is24Hour={true}
              onChange={onChangeEnd}
            />
          )}
        </SafeAreaView> */}

        <Text style={commonStyles.label}>{words.duration}</Text>
        <TextInput
          style={commonStyles.input}
          placeholder={words.enterDuration}
          placeholderTextColor={Colors.mediumGrey}
          value={duration}
          onChangeText={setDuration}
        />

        <Text style={commonStyles.label}>{words.notes}</Text>
        <TextInput
          style={commonStyles.input}
          placeholder={words.enterNotes}
          placeholderTextColor={Colors.mediumGrey}
          value={notes}
          onChangeText={setNotes}
        />

        <Text style={commonStyles.label}>{words.studentId}</Text>
        <TextInput
          style={commonStyles.input}
          placeholder={words.enterStudentId}
          placeholderTextColor={Colors.mediumGrey}
          value={studentId}
          onChangeText={setStudentId}
        />
      </View>

      <View style={styles.buttonBlock}>
        <View style={[styles.buttonContainer, styles.buttonFirst]}>
          <Button label={words.reset} onPress={handleReset} />
        </View>
        <View style={styles.buttonContainer}>
          <Button theme="primary" label={words.create} onPress={handleCreateLesson} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: Colors.paleGrey,
  },
  buttonBlock: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    marginTop: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonFirst: {
    marginRight: 16,
  },
  buttonContainer: {
    flex: 1,
  },
});
