import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Keyboard } from 'react-native';
import { getUserIdByFullNameService } from '@/services/authService';
import words from '@/locales/ru';
import commonStyles from '@/styles/CommonStyles';
import Button from '@/components/General/Interactive/Button';
import { TextInput } from 'react-native';
import { Colors } from '@/styles/Colors';
import { Student } from '@/models/models';

interface UserSearchProps {
  onUserFound: (student: Student) => void;
  resetFlag: boolean;
  setResetFlag: (flag: boolean) => void;
  initialStudent?: Student;
}

const UserSearch: React.FC<UserSearchProps> = ({ onUserFound, resetFlag, setResetFlag, initialStudent }) => {
  const [studentName, setStudentName] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  useEffect(() => {
    if (resetFlag) {
      setStudentName('');
      setStudents([]);
      setSelectedStudentId(null);
      setResetFlag(false);
    }
  }, [resetFlag, setResetFlag]);

  useEffect(() => {
    if (initialStudent && !selectedStudentId) {
      setStudentName(`${initialStudent.first_name} ${initialStudent.last_name}`);
      setSelectedStudentId(initialStudent.id);
      onUserFound(initialStudent);
    }
  }, []);

  const handleSearchStudent = async () => {
    if (!studentName.trim()) {
      Alert.alert(words.error, words.enterStudentName);
      return;
    }

    try {
      const users = await getUserIdByFullNameService(studentName);
      if (users.length === 0) {
        Alert.alert(words.error, words.studentNotFound);
      } else {
        setStudents(users);
        if (users.length === 1) {
          handleSelectStudent(users[0]);
        }
      }
    } catch (error) {
      Alert.alert(words.error);
    }
  };

  const handleSelectStudent = (student: Student) => {
    setStudentName(`${student.first_name} ${student.last_name}`);
    setSelectedStudentId(student.id);
    onUserFound(student);
  };

  const handleSubmitEditing = () => {
    handleSearchStudent();
    Keyboard.dismiss();
  };

  return (
    <View style={styles.searchContainer}>
      <Text style={commonStyles.label}>{words.studentName}</Text>
      <View style={styles.inputContainer}>
        <View style={styles.input}>
          <TextInput
            style={commonStyles.input}
            placeholder={words.enterStudentName}
            placeholderTextColor={Colors.mediumGrey}
            value={studentName}
            onChangeText={setStudentName}
            onSubmitEditing={handleSubmitEditing}
            returnKeyType="search"
          />
        </View>
        <View style={styles.searchButton}>
          <Button label={words.search} onPress={handleSearchStudent} />
        </View>
      </View>

      {students.length > 0 &&
        students.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => handleSelectStudent(item)}>
            <View style={styles.studentItem}>
              <Text
                style={[styles.studentName, item.id === selectedStudentId && styles.selectedStudentName]}
              >
                {item.first_name} {item.last_name} (ID: {item.id})
              </Text>
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    height: 52,
    flexDirection: 'row',
  },
  input: {
    flexGrow: 1,
  },
  searchButton: {
    width: 100,
    marginLeft: 8,
    bottom: 1,
    flexShrink: 1,
  },
  studentItem: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: Colors.lightGrey,
  },
  studentName: {
    color: Colors.deepGrey,
    fontSize: 16,
  },
  selectedStudentName: {
    fontWeight: 'bold',
    color: Colors.mediumGrey,
  },
});

export default UserSearch;
