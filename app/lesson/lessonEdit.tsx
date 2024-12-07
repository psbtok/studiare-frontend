import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Keyboard, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Button from '@/components/General/Interactive/Button';
import { useRouter } from 'expo-router';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import { createLessonService, modifyLessonService } from '@/services/lessonService';
import commonStyles from '@/styles/CommonStyles';
import TimeRangePickerComponent from '@/components/General/Interactive/TimeRangePicker';
import NumberPicker from '@/components/General/Interactive/NumberPicker';
import { validateCreateLessonInput } from '@/validators/validators';
import { Lesson } from '@/models/models';
import { Router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';

export default function CreateLessonScreen() {
  const local = useLocalSearchParams();
  const lessonParam = local.lesson;
  
  let lesson: Lesson;

  if (typeof lessonParam === 'string') {
    lesson = JSON.parse(lessonParam) as Lesson;
  } else {
    lesson = JSON.parse(lessonParam[0]) as Lesson;
  }
  const initialPrice = 1000;

  const [subject, setSubject] = useState(lesson?.subject || '');
  const [notes, setNotes] = useState(lesson?.notes || '');
  const [studentId, setStudentId] = useState(lesson?.student.user.id.toString() || '');
  const [dateStart, setDateStart] = useState(new Date(lesson?.date_start || Date.now()));
  const [dateEnd, setDateEnd] = useState(new Date(lesson?.date_end || Date.now()));
  const [price, setPrice] = useState(lesson?.price || initialPrice);

  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();
  
  const handleModifyLesson = async () => {
    const errors = validateCreateLessonInput(subject, studentId, dateStart, dateEnd, price);
  
    if (errors.length > 0) {
      Alert.alert(words.error, errors.join('\n'));
      return;
    }
  
    try {
      lesson.subject = subject
      lesson.date_start = dateStart.toISOString()
      lesson.date_end = dateEnd.toISOString()
      lesson.price = price
      lesson.notes = notes
      await modifyLessonService(lesson);
  
      Alert.alert(
        words.success,
        words.lessonUpdated,
        [
          {
            text: words.ok,
            onPress: () => {
              router.replace({
                pathname: '/lesson/lessonDetail',
                params: { lesson: JSON.stringify(lesson) }
              })     
            }
            
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
    setPrice(initialPrice);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        ref={scrollViewRef} 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View>
        <TimeRangePickerComponent
          onDateTimeChange={(date, startTime, endTime) => {
              setDateStart(startTime);
              setDateEnd(endTime);
          }}
          initialStartTime={new Date(lesson.date_start)}
          initialEndTime={new Date(lesson.date_end)}
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
      </ScrollView>

      <View style={styles.buttonBlock}>
        <View style={[styles.buttonContainer, styles.buttonFirst]}>
          <Button label={words.reset} onPress={handleReset} />
        </View>
        <View style={styles.buttonContainer}>
          <Button theme="primary" label={words.save} onPress={handleModifyLesson} />
        </View>
      </View>
    </KeyboardAvoidingView>
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
  scrollContainer: {
    paddingBottom: 50,
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
    flex: 1,
  },
  buttonContainer: {
    flex: 1.5,
  },
});