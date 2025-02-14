import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Import useRouter
import { Colors } from '@/styles/Colors';
import { Typography } from '@/styles/Typography';
import words from '@/locales/ru';
import { Subject } from '@/models/models';
import commonStyles from '@/styles/CommonStyles';
import Button from '@/components/General/Interactive/Button';
import { deleteSubjectService } from '@/services/lessonService'; 
import { subjectColors } from '@/styles/Colors';

export default function SubjectDetailScreen() {
  const { subject } = useLocalSearchParams();
  const router = useRouter(); 
  const subjectString = Array.isArray(subject) ? subject[0] : subject;
  const parsedSubject: Subject = JSON.parse(subjectString);

  const color =
    parsedSubject.colorId && parsedSubject.colorId < 10
      ? subjectColors[parsedSubject.colorId - 1]
      : subjectColors[0];

  const handleEdit = () => {
    router.push({
      pathname: '/subject/subjectEdit',
      params: { subject: JSON.stringify(parsedSubject) },
    });
  };

  const handleDelete = async () => {
    Alert.alert(
      words.delete,
      words.confirmDeleteSubject,
      [
        { text: words.no, style: 'cancel' },
        {
          text: words.yesDelete,
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSubjectService(parsedSubject.id); 
              Alert.alert(words.success, words.subjectDeletedSuccessfully, [
                {
                  text: words.ok,
                  onPress: () => {
                    router.replace('/(tabs)/subject'); 
                  },
                },
              ]);
            } catch (error: any) {
              Alert.alert(words.error, error.message || words.error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={[styles.lessonDetailsHeader, {borderLeftColor: color}]}>
          <Text style={styles.lessonSubjectText}>{parsedSubject.title}</Text>
        </View>

        {parsedSubject.notes && (
          <View style={styles.lessonDetailsSection}>
            <Text style={[commonStyles.label, styles.notesLabel]}>{`${words.notes}:`}</Text>
            <Text style={commonStyles.label}>{parsedSubject.notes}</Text>
          </View>
        )}

      </ScrollView>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonSmall}>
          <Button label={words.delete} onPress={handleDelete} />
        </View>
        <View style={styles.buttonBig}>
          <Button theme="primary" label={words.edit} onPress={handleEdit} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.paleGrey,
  },
  scrollView: {
    flex: 1,
    marginBottom: 16, 
  },
  lessonDetailsHeader: {
    paddingVertical: 12,
    paddingTop: 16,
    paddingHorizontal: 21,
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: Colors.deepGrey,
    borderRadius: 16,
    marginBottom: 12,
    borderLeftWidth: 8
  },
  lessonDetailsSection: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: Colors.lightGrey,
    marginBottom: 12,
    shadowColor: Colors.deepGrey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lessonSubjectText: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: 'bold',
    color: Colors.paleGrey,
    textAlign: 'center',
    marginBottom: 8,
  },
  notesLabel: {
    fontSize: Typography.fontSizes.m,
    marginBottom: 8,
  },
  colorBox: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  buttonSmall: {
    flex: 1,
    marginRight: 8, 
  },
  buttonBig: {
    flex: 1.5,
  },
});