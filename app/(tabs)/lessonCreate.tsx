import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Keyboard, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Button from '@/components/General/Interactive/Button';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import { createLessonService } from '@/services/lessonService';
import commonStyles from '@/styles/CommonStyles';
import TimeRangePickerComponent from '@/components/General/Interactive/TimeRangePicker';
import NumberPicker from '@/components/General/Interactive/NumberPicker';
import { validateLessonInput } from '@/validators/validators';
import UserSearch from '@/components/General/Interactive/UserSearch';
import { User, Subject } from '@/models/models'; 
import SubjectSelectionModal from '../subject/subjectSelectionModal';
import { useDispatch } from 'react-redux';
import { setUpdateLesson } from '../store/store';

export default function CreateLessonScreen() {
  const emptyUser = { id: '', first_name: '', last_name: '', email: '' }
  const emptySubject = {id: 0, title: 'string', notes: '', colorId: 1, user: emptyUser}
  const local = useLocalSearchParams();
  const subjectParam = local.subject ? JSON.parse(local.subject) : {'id': 0};

  const initialPrice = 1000;
  const [subject, setSubject] = useState<Subject>(emptySubject);
  const [notes, setNotes] = useState('');
  const [participants, setParticipants] = useState<User[]>([]);
  const [resetFlag, setResetFlag] = useState(false);
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [price, setPrice] = useState(initialPrice);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); 
  const dispatch = useDispatch();
  
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (subjectParam) {
      if (subjectParam !== subject) {
        setSubject(subjectParam);
        if (subjectParam.notes && subjectParam.notes !== notes) {
          setNotes(subjectParam.notes);
        } else {
          setNotes('')
        }
      }
    }
  }, [subjectParam.id]);

  const handleCreateLesson = async () => {
    const errors = validateLessonInput(subject, participants, dateStart, dateEnd, price);

    if (errors.length > 0) {
      Alert.alert(words.error, errors.join('\n'));
      return;
    }

    setIsLoading(true);
    try {
      const timezoneOffsetHours = new Date().getTimezoneOffset() / -60; 
  
      const adjustedDateStart = new Date(dateStart.getTime() + timezoneOffsetHours * 60 * 60 * 1000);
      const adjustedDateEnd = new Date(dateEnd.getTime() + timezoneOffsetHours * 60 * 60 * 1000);
  
      let lesson = await createLessonService(
        participants,
        subject.id,
        adjustedDateStart.toISOString(),
        adjustedDateEnd.toISOString(),
        price,
        notes
      );

      dispatch(setUpdateLesson(lesson));
      Alert.alert(
        words.success,
        words.lessonCreated,
        [
          {
            text: words.ok,
            onPress: () => {
              router.navigate('/(tabs)');
              router.navigate({
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSubject(emptySubject);
    setDateStart(new Date());
    setDateEnd(new Date());
    setNotes('');
    setParticipants([]); 
    setPrice(initialPrice);
    setResetFlag(true);
  };

  const handleParticipantsFound = (newparticipants: User[]) => {
    setParticipants(newparticipants); 
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
        />

        <Text style={commonStyles.label}>{words.subject}</Text>
        <Button 
          label={subject?.id ? subject.title : words.selectSubject} 
          onPress={() => setModalVisible(true)} 
        />

        <Text style={commonStyles.label}>{words.notes}</Text>
        <TextInput
          style={commonStyles.input}
          placeholder={words.enterNotes}
          placeholderTextColor={Colors.mediumGrey}
          value={notes}
          maxLength={256}
          multiline={true}
          onChangeText={setNotes}
        />

        <UserSearch 
          onParticipantsSelected={handleParticipantsFound} 
          resetFlag={resetFlag} 
          setResetFlag={setResetFlag} 
        />

        <Text style={commonStyles.label}>{words.lessonPrice}</Text>
        <NumberPicker
          value={price}
          step={100}
          min={0}
          max={50000}
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
            label={isLoading ? words.creating : words.create} 
            disabled={isLoading}
            onPress={handleCreateLesson}
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
    flex: 1
  },
  buttonContainer: {
    flex: 1.5,
  },
});
