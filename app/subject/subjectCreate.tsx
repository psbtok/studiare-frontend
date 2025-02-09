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
import { useRouter } from 'expo-router';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import { createSubjectService } from '@/services/lessonService';
import commonStyles from '@/styles/CommonStyles';
import { validateCreateSubjectInput } from '@/validators/validators';
import ColorPicker from '@/components/General/Interactive/ColorPicker';

export default function CreateSubjectScreen() {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [colorId, setColorId] = useState<number | null>(1); 
  const router = useRouter();

  const handleCreateSubject = async () => {
    if (!colorId) {
      Alert.alert(words.error, words.colorNotSelected);
      return;
    }

    const errors = validateCreateSubjectInput(title, colorId);
    if (errors.length > 0) {
      Alert.alert(words.error, errors.join('\n'));
      return;
    }

    try {
      const subject = await createSubjectService(
        title,
        colorId,
        notes
      );
      Alert.alert(
        words.success,
        words.subjectCreated,
        [
          {
            text: words.ok,
            onPress: () => {
              router.replace({
                pathname: '/subject/subjectDetail',
                params: { subject: JSON.stringify(subject) },
              });
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Error creating subject:', error.message);
      Alert.alert(words.error, error.message);
    }
  };

  const handleReset = () => {
    setTitle('');
    setNotes('');
    setColorId(1);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.formContainer}>
        <Text style={commonStyles.label}>{words.subjectTitle}</Text>
        <TextInput
          style={commonStyles.input}
          placeholder={words.enterSubjectTitle}
          placeholderTextColor={Colors.mediumGrey}
          value={title}
          onChangeText={setTitle}
        />
        <Text style={commonStyles.label}>{words.color}</Text>
        <ColorPicker
          onSelect={(id) => setColorId(id)}
          selectedColorId={colorId}
        />
        <Text style={commonStyles.label}>{words.notes}</Text>
        <TextInput
          style={commonStyles.input}
          placeholder={words.enterNotes}
          placeholderTextColor={Colors.mediumGrey}
          value={notes}
          onChangeText={setNotes}
        />
      </View>
      <View style={styles.buttonBlock}>
        <View style={[styles.buttonContainer, styles.buttonFirst]}>
          <Button label={words.reset} onPress={handleReset} />
        </View>
        <View style={styles.buttonContainer}>
          <Button theme="primary" label={words.create} onPress={handleCreateSubject} />
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
