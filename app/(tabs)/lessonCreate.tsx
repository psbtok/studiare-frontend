import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import Button from '@/components/General/Interactive/Button';
import { useRouter } from 'expo-router';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import { createLessonService } from '@/services/lessonService';
import commonStyles from '@/styles/CommonStyles';
import TimeRangePickerComponent from '@/components/General/Interactive/TimeRangePicker';
import NumberPicker from '@/components/General/Interactive/NumberPicker';
import { validateCreateLessonInput } from '@/validators/validators';

export default function CreateLessonScreen() {
  const initialPrice = 1000;

  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [studentId, setStudentId] = useState('');
  const router = useRouter();
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [price, setPrice] = useState(initialPrice)

  const handleCreateLesson = async () => {
    const errors = validateCreateLessonInput(subject, studentId, dateStart, dateEnd, price);
  
    if (errors.length > 0) {
      Alert.alert(words.error, errors.join('\n'));
      return;
    }
  
    try {
      await createLessonService(
        parseInt(studentId),
        subject,
        dateStart.toISOString(),
        dateEnd.toISOString(),
        price,
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
    setNotes('');
    setStudentId('');
    setPrice(initialPrice)
  };

  return (
    <View style={styles.container}>
      <View>
        <View>
          <TimeRangePickerComponent
              onDateTimeChange={(date, startTime, endTime) => {
                  setDateStart(startTime)
                  setDateEnd(endTime)
              }}
            />
        </View>
        <Text style={commonStyles.label}>{words.subject}</Text>
        <TextInput
          style={commonStyles.input}
          placeholder={words.enterSubject}
          placeholderTextColor={Colors.mediumGrey}
          value={subject}
          onChangeText={setSubject}
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
        <Text style={commonStyles.label}>{words.lessonPrice}</Text>
        <NumberPicker
          value={price}
          step={100}
          onValueChange={setPrice}
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
