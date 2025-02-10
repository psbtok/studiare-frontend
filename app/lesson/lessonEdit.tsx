import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Keyboard, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Button from '@/components/General/Interactive/Button';
import { useRouter } from 'expo-router';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import { modifyLessonService } from '@/services/lessonService';
import commonStyles from '@/styles/CommonStyles';
import TimeRangePickerComponent from '@/components/General/Interactive/TimeRangePicker';
import NumberPicker from '@/components/General/Interactive/NumberPicker';
import { validateCreateLessonInput } from '@/validators/validators';
import { Lesson, Student, Subject } from '@/models/models'; 
import { useLocalSearchParams } from 'expo-router/build/hooks';
import UserSearch from '@/components/General/Interactive/UserSearch';
import SubjectSelectionModal from '../subject/subjectSelectionModal';

export default function LessonEditScreen() {
  const local = useLocalSearchParams();
  const lessonParam = local.lesson;

  let lesson: Lesson;
  if (typeof lessonParam === 'string') {
    lesson = JSON.parse(lessonParam) as Lesson;
  } else {
    lesson = JSON.parse(lessonParam[0]) as Lesson;
  }

  const initialPrice = 1000;

  const [subject, setSubject] = useState<Subject | null>(lesson?.subject || {'title': ''});
  const [notes, setNotes] = useState(lesson?.notes || '');
  const [student, setStudent] = useState<Student>(lesson?.student.user || { id: '', first_name: '', last_name: '' });
  const [resetFlag, setResetFlag] = useState(false);
  const [dateStart, setDateStart] = useState(new Date(lesson?.date_start || Date.now()));
  const [dateEnd, setDateEnd] = useState(new Date(lesson?.date_end || Date.now()));
  const [price, setPrice] = useState(lesson?.price || initialPrice);
  const [isLoading, setIsLoading] = useState(false); 
  const [modalVisible, setModalVisible] = useState(false); 

  const [initialLesson, setInitialLesson] = useState<Lesson>(lesson);

  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();
  
  const handleModifyLesson = async () => {
    const errors = validateCreateLessonInput(subject, student.id.toString(), dateStart, dateEnd, price);

    if (errors.length > 0) {
      Alert.alert(words.error, errors.join('\n'));
      return;
    }

    setIsLoading(true); 
    try {
      lesson.subject = subject;
      lesson.date_start = dateStart.toISOString();
      lesson.date_end = dateEnd.toISOString();
      lesson.price = price;
      lesson.notes = notes;

      lesson.student.user = {
        ...lesson.student.user, 
        first_name: student.first_name,
        id: student.id,
        last_name: student.last_name
      }

      await modifyLessonService({...lesson, studentId: student.id});

      Alert.alert(
        words.success,
        words.lessonUpdated,
        [
          {
            text: words.ok,
            onPress: () => {
              router.replace({
                pathname: '/lesson/lessonDetail',
                params: { lesson: JSON.stringify(lesson) },
              });
            }
          },
        ]
      );
    } catch (error: any) {
      console.error('Error updating lesson:', error.message);
      Alert.alert(words.error, error.message);
    } finally {
      setIsLoading(false); 
    }
  };

  const handleReset = () => {
    setSubject(initialLesson.subject);
    setDateStart(new Date(initialLesson.date_start));
    setDateEnd(new Date(initialLesson.date_end));
    setNotes(initialLesson.notes ?? '');
    setStudent(initialLesson.student.user);
    setPrice(initialLesson.price);
    setResetFlag(true);
  };


  const handleStudentFound = (student: Student) => {
    setStudent({
      first_name: student.first_name,
      id: student.id,
      last_name: student.last_name
    });
  };

  const handleSubjectSelect = (selectedSubject: Subject) => {
    setSubject(selectedSubject);
    if (selectedSubject.notes?.length) {
      setNotes(selectedSubject.notes);
    }
  };

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
        <TimeRangePickerComponent
          onDateTimeChange={(date, startTime, endTime) => {
            setDateStart(startTime);
            setDateEnd(endTime);
          }}
          initialStartTime={new Date(lesson.date_start)}
          initialEndTime={new Date(lesson.date_end)}
        />

        <Text style={commonStyles.label}>{words.subject}</Text>
        <Button 
          label={subject ? subject.title : words.selectSubject} 
          onPress={() => setModalVisible(true)} 
        />

        <Text style={commonStyles.label}>{words.notes}</Text>
        <TextInput
          style={commonStyles.input}
          placeholder={words.enterNotes}
          placeholderTextColor={Colors.mediumGrey}
          value={notes}
          onChangeText={setNotes}
        />

        <UserSearch 
          onUserFound={handleStudentFound} 
          resetFlag={resetFlag} 
          setResetFlag={setResetFlag} 
          initialStudent={{ 
            id: lesson.student.user.id.toString(),
            first_name: lesson.student.user.first_name, 
            last_name: lesson.student.user.last_name 
          }}
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
          <Button 
            theme="primary" 
            label={isLoading ? words.saving : words.save} 
            disabled={isLoading} 
            onPress={handleModifyLesson} 
          />
        </View>
      </View>

      <SubjectSelectionModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        onSelect={handleSubjectSelect} 
      />
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
