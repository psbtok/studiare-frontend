import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Keyboard } from 'react-native';
import { getUserIdByFullNameService } from '@/services/authService';
import words from '@/locales/ru';
import commonStyles from '@/styles/CommonStyles';
import Button from '@/components/General/Interactive/Button';
import { TextInput } from 'react-native';
import { Colors } from '@/styles/Colors';

interface UserSearchProps {
  onUserFound: (userId: string) => void;
  resetFlag: boolean;
  setResetFlag: (flag: boolean) => void;
  initialStudent?: { id: string, firstName: string, lastName: string }; // Optional initial student prop
}

const UserSearch: React.FC<UserSearchProps> = ({ onUserFound, resetFlag, setResetFlag, initialStudent }) => {
  const [studentName, setStudentName] = useState('');
  const [students, setStudents] = useState<{ id: string, first_name: string, last_name: string }[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Handle resetting the state when the resetFlag is triggered
  useEffect(() => {
    if (resetFlag) {
      setStudentName('');
      setStudents([]);
      setSelectedStudentId(null);
      setResetFlag(false);
    }
  }, [resetFlag, setResetFlag]);

  // Only set initial student if no student is selected already
  useEffect(() => {
    if (initialStudent && !selectedStudentId) {
      setStudentName(`${initialStudent.firstName} ${initialStudent.lastName}`);
      setSelectedStudentId(initialStudent.id);
      onUserFound(initialStudent.id);  // Automatically select the initial student if no student selected
    }
  }, [initialStudent, selectedStudentId, onUserFound]);

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
          // Auto-select the first student if only one result is found
          handleSelectStudent(users[0].id, users[0].first_name, users[0].last_name);
        }
      }
    } catch (error) {
      Alert.alert(words.error);
    }
  };

  const handleSelectStudent = (userId: string, firstName: string, lastName: string) => {
    setStudentName(`${firstName} ${lastName}`);
    setSelectedStudentId(userId);
    onUserFound(userId.toString());
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
          <Button label={words.search} onPress={handleSearchStudent} inline={true} />
        </View>
      </View>

      {students.length > 0 &&
        students.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => handleSelectStudent(item.id, item.first_name, item.last_name)}>
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
