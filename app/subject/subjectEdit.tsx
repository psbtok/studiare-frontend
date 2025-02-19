import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import Button from '@/components/General/Interactive/Button';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import { editSubjectService } from '@/services/lessonService';
import commonStyles from '@/styles/CommonStyles';
import { validateCreateSubjectInput } from '@/validators/validators';
import ColorPicker from '@/components/General/Interactive/ColorPicker';
import { Subject } from '@/models/models';

export default function SubjectEditScreen() {
  const { subject } = useLocalSearchParams();
  const subjectString = Array.isArray(subject) ? subject[0] : subject;
  const parsedSubject: Subject = JSON.parse(subjectString);

  const [title, setTitle] = useState(parsedSubject.title);
  const [notes, setNotes] = useState(parsedSubject.notes || '');
  const [colorId, setColorId] = useState<number | null>(parsedSubject.colorId || 1);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const router = useRouter();

  const handleSave = async () => {
    if (!colorId) {
      Alert.alert(words.error, words.colorNotSelected);
      return;
    }

    const errors = validateCreateSubjectInput(title, colorId);
    if (errors.length > 0) {
      Alert.alert(words.error, errors.join('\n'));
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const updatedSubject = await editSubjectService(
        parsedSubject.id,
        title,
        colorId,
        notes,
      );

      Alert.alert(
        words.success,
        words.subjectUpdated,
        [
          {
            text: words.ok,
            onPress: () => {
              router.replace({
                pathname: '/subject',
                // params: { subject: JSON.stringify(updatedSubject) },
              });
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Error updating subject:', error.message);
      Alert.alert(words.error, error.message);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleReset = () => {
    setTitle(parsedSubject.title);
    setNotes(parsedSubject.notes || '');
    setColorId(parsedSubject.colorId || 1);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.formContainer}>
        <Text style={commonStyles.label}>{words.color}</Text>
        <ColorPicker
          onSelect={(id) => setColorId(id)}
          selectedColorId={colorId}
        />
        <Text style={commonStyles.label}>{words.subjectTitle}</Text>
        <TextInput
          style={commonStyles.input}
          placeholder={words.enterSubjectTitle}
          placeholderTextColor={Colors.mediumGrey}
          value={title}
          maxLength={64}
          onChangeText={setTitle}
        />
        <Text style={commonStyles.label}>{words.notes}</Text>
        <TextInput
          style={commonStyles.input}
          placeholder={words.enterNotes}
          placeholderTextColor={Colors.mediumGrey}
          value={notes}
          maxLength={256}
          onChangeText={setNotes}
        />
      </View>
      <View style={styles.buttonBlock}>
        <View style={[styles.buttonContainer, styles.buttonFirst]}>
          <Button label={words.reset} onPress={handleReset} />
        </View>
        <View style={styles.buttonContainer}>
          <Button 
            theme="primary" 
            label={isLoading ? words.saving : words.save} 
            onPress={handleSave} 
            disabled={isLoading} 
          />
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
  formContainer: {
    flex: 1,
    justifyContent: 'flex-start',
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
