import React, { useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableWithoutFeedback, View, StyleSheet, GestureResponderEvent, Pressable } from 'react-native';
import Header from '@/components/General/Header/Header';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function TabLayout() {
  const [isTutor, setIsTutor] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const profile = await AsyncStorage.getItem('profile');
      if (profile) {
        const parsedProfile = JSON.parse(profile);
        setIsTutor(parsedProfile.is_tutor);
      }
    };
    loadProfile();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.darkBlue,
        tabBarStyle: {
          backgroundColor: Colors.paleGrey,
          height: 56,
          position: 'relative',
          paddingTop: 8
        },
        tabBarShowLabel: false,
        header: ({ route }) => {
          const titles: Record<string, string> = {
            index: words.lessonList,
            lessonCreate: words.lessonCreation,
            profile: words.profile,
            calendar: words.calendar,
          };
          const showLogoutButton = route.name === 'profile';
          return (
            <Header
              title={titles[route.name]}
              showLogoutButton={showLogoutButton}
            />
          );
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: words.exercises,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'list' : 'list-outline'}
              color={color}
              size={28}
            />
          ),
          href: '/(tabs)',
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: words.calendar,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              color={color}
              size={28}
            />
          ),
          href: '/(tabs)/calendar'
        }}
      />
      <Tabs.Screen
        name="lessonCreate"
        options={{
          title: words.createLesson,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'add-circle' : 'add-circle-outline'}
              color={color}
              size={28}
            />
          ),
          href: isTutor ? '/lessonCreate' : null, 
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: words.profile,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              color={color}
              size={28}
            />
          ),
          href: '/(tabs)/profile'
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
