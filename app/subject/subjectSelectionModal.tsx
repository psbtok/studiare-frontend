import React, { useEffect, useState } from 'react';
import { Modal, View, FlatList, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '@/styles/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import words from '@/locales/ru';
import { Subject } from '@/models/models';
import Button from '@/components/General/Interactive/Button';
import { getSubjectListService } from '@/services/lessonService';
import commonStyles from '@/styles/CommonStyles';
import { subjectColors } from '@/styles/Colors';
import { useRouter } from 'expo-router';
import { Typography } from '@/styles/Typography';

interface SubjectSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (subject: Subject) => void;
}

const SubjectSelectionModal = ({ visible, onClose, onSelect }: SubjectSelectionModalProps) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  
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
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const subjectsData = await AsyncStorage.getItem('subjects');
        if (subjectsData) {
          const parsedData = JSON.parse(subjectsData);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            setSubjects(parsedData);
          } else {
            refreshSubjects();
          }
        } else {
          refreshSubjects();
        }
      } catch (error: any) {
        Alert.alert(words.error, error.message || words.error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSubjects();
  }, []);

  const handleCreate = () => {
    router.push('/subject/subjectCreate')
    onClose()
  }

  const renderSubjectItem = (item: Subject) => {
    const color =
      item.colorId && item.colorId < 10
        ? subjectColors[item.colorId - 1]
        : Colors.subjectColor0;

    return (
      <TouchableOpacity onPress={() => { onSelect(item); onClose(); }}>
        <View style={[styles.subjectItem, { borderColor: color }]}>
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
          <View style={styles.buttonContainer}>
              <View style={styles.buttonSmall}>
                <Button onPress={handleCreate} theme="primary" label={words.create} />
              </View>
              <View style={styles.buttonBig}>
                <Button 
                  onPress={refreshSubjects} 
                  theme="primary" 
                  label={loading ? words.loading : words.refresh} 
                  disabled={loading}
                />
              </View>
            </View>
          {subjects.length === 0 ? (
            <Text style={styles.noSubjectsText}>{words.noSubjectsAvailable}</Text>
          ) : (
            <FlatList
              data={subjects}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => renderSubjectItem(item)}
            />
          )}
          <View style={styles.buttonContainer}>
            <View style={styles.buttonBig}>
              <Button
                label={words.close}
                theme="primary"
                onPress={onClose}
              />
            </View>
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
    backgroundColor: Colors.modalBackground,
  },
  modalContent: {
    width: '90%',
    backgroundColor: Colors.paleGrey,
    borderRadius: 16,
  },
  subjectItem: {
    padding: 8,
    marginVertical: 4,
    marginHorizontal: 16,
    borderWidth: 4,
    borderRadius: 12,
    backgroundColor: Colors.lightGrey
  },
  subjectText: {
    fontSize: Typography.fontSizes.m,
    padding: 2,
    paddingHorizontal: 12,
    fontWeight: 600,
    color: Colors.mediumGrey,
  },
  refreshContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  refreshButton: {
    alignSelf: 'flex-end',
  },
  loadingLabel: {
    color: Colors.mediumGrey,
    fontWeight: '500',
    marginLeft: 12
  },
  noSubjectsText: {
    textAlign: 'center',
    color: Colors.mediumGrey,
    fontSize: 16,
    marginVertical: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16
  },
  buttonSmall: {
    flex: 1,
    marginRight: 12, 
  },
  buttonBig: {
    flex: 1,
  },
});

export default SubjectSelectionModal;
