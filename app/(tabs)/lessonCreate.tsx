import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Keyboard, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Button from '@/components/General/Interactive/Button';
import { useRouter } from 'expo-router';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import { createLessonService } from '@/services/lessonService';
import commonStyles from '@/styles/CommonStyles';
import TimeRangePickerComponent from '@/components/General/Interactive/TimeRangePicker';
import NumberPicker from '@/components/General/Interactive/NumberPicker';
import { validateCreateLessonInput } from '@/validators/validators';
import UserSearch from '@/components/General/Interactive/UserSearch';
import { Student } from '@/models/models'; 

export default function CreateLessonScreen() {
  const initialPrice = 1000;

  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [student, setStudent] = useState<Student>({ id: '', first_name: '', last_name: '' });
  const [resetFlag, setResetFlag] = useState(false);
  const router = useRouter();
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [price, setPrice] = useState(initialPrice);

  const scrollViewRef = useRef<ScrollView>(null);

  const handleCreateLesson = async () => {
    const errors = validateCreateLessonInput(subject, student.id.toString(), dateStart, dateEnd, price);

    if (errors.length > 0) {
      Alert.alert(words.error, errors.join('\n'));
      return;
    }

    try {
      let lesson = await createLessonService(
        parseInt(student.id),
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
            onPress: () => {
              router.replace({
                pathname: '/lesson/lessonDetail',
                params: { lesson: JSON.stringify(lesson) }
              });
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
    setStudent({ id: '', first_name: '', last_name: '' }); // Reset student object
    setPrice(initialPrice);
    setResetFlag(true);
  };

  const handleStudentFound = (foundStudent: Student) => {
    setStudent(foundStudent); // Set the entire Student object
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

        {/* Pass resetFlag to UserSearch */}
        <UserSearch 
          onUserFound={handleStudentFound} 
          resetFlag={resetFlag} 
          setResetFlag={setResetFlag} 
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
          <Button theme="primary" label={words.create} onPress={handleCreateLesson} />
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
    flex: 1
  },
  buttonContainer: {
    flex: 1.5,
  },
});
