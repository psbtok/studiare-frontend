import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Colors } from '@/styles/Colors';
import LessonList from '@/components/Lesson/lessonList';
import LessonListArchive from '@/components/Lesson/lessonListArchive';
import { Typography } from '@/styles/Typography';

export default function Index() {
  const [isCurrent, setIsCurrent] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('login-token');
        if (!token) {
          router.replace('/auth/welcome');
        }
      } catch (e) {
        console.error('Error reading token', e);
      }
    };
    checkToken();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.buttonContainer}>
        <Pressable
          style={[
            styles.button,
            isCurrent ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={() => setIsCurrent(true)}
        >
          <Text style={isCurrent ? styles.activeText : styles.inactiveText}>Актуальные</Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            !isCurrent ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={() => setIsCurrent(false)}
        >
          <Text style={!isCurrent ? styles.activeText : styles.inactiveText}>Архив</Text>
        </Pressable>
      </View>
      {isCurrent ? <LessonList /> : <LessonListArchive />}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paleGrey,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    borderRadius: 12,
    backgroundColor: Colors.lightGrey,
    width: '80%',
    marginBottom: 8
  },
  button: {
    width: '50%',
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: Colors.deepGrey,
  },
  inactiveButton: {},
  activeText: {
    color: Colors.paleGrey,
    fontSize: Typography.fontSizes.s,
    textAlign: 'center',
    fontWeight: '500'
  },
  inactiveText: {
    color: Colors.deepGrey,
    fontSize: Typography.fontSizes.s,
    textAlign: 'center',
    fontWeight: '500'
  },
});
