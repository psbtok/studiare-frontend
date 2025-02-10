import React, { useEffect, useState } from 'react';
import { Modal, View, FlatList, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '@/styles/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import words from '@/locales/ru';
import { Subject } from '@/models/models';
import Button from '@/components/General/Interactive/Button';
import { getSubjectListService } from '@/services/lessonService';

interface SubjectSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (subject: Subject) => void;
}

const SubjectSelectionModal = ({ visible, onClose, onSelect }: SubjectSelectionModalProps) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  const subjectColors = [
    Colors.subjectColor0,
    Colors.subjectColor1,
    Colors.subjectColor2,
    Colors.subjectColor3,
    Colors.subjectColor4,
    Colors.subjectColor5,
    Colors.subjectColor6,
    Colors.subjectColor7,
    Colors.subjectColor8,
  ];

  const refreshSubjects = async () => {
    setLoading(true);
      try {
        const subjectsData = await getSubjectListService();
        if (subjectsData) {
          setSubjects(subjectsData);
        }
      } catch (error: any) {
        Alert.alert(words.error, error.message || words.error);
      } finally {
        setLoading(false);
      }
  }

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const subjectsData = await AsyncStorage.getItem('subjects');
        if (subjectsData) {
          setSubjects(JSON.parse(subjectsData));
        }
      } catch (error: any) {
        Alert.alert(words.error, error.message || words.error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const renderSubjectItem = (item: Subject) => {
    const color =
      item.colorId && item.colorId < 10
        ? subjectColors[item.colorId - 1]
        : Colors.subjectColor0;

    return (
      <TouchableOpacity onPress={() => { onSelect(item); onClose(); }}>
        <View style={[styles.subjectItem, { borderLeftColor: color }]}>
          <Text style={styles.subjectText}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.refreshContainer}>
            <Button onPress={refreshSubjects} label={words.close}  hasIcon={true} icon='refresh-circle'></Button>
          </View>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            <FlatList
              data={subjects}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => renderSubjectItem(item)}
            />
          )}
          <View style={styles.buttonContainer}>
            <Button
              label={words.close}
              theme="primary"
              onPress={onClose}
            >
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: Colors.paleGrey,
    borderRadius: 16,
    padding: 16,
  },
  subjectItem: {
    padding: 8,
    margin: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
    borderLeftWidth: 3,
  },
  subjectText: {
    fontSize: 16,
    color: Colors.deepGrey,
  },
  buttonContainer: {
    marginTop: 16,
  },
  refreshContainer: {
    width: 52,
    alignSelf: 'flex-end'
  }
});

export default SubjectSelectionModal;
