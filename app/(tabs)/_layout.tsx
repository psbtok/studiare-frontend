import React, { useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet } from 'react-native';
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

  const CustomTabBarButton = ({ children, onPress }: { children: React.ReactNode, onPress?: () => void }) => (
    <Pressable onPress={onPress} style={styles.tabButton}>
      {children}
    </Pressable>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.darkBlue,
        tabBarStyle: {
          backgroundColor: Colors.paleGrey,
          height: 56,
          width: isTutor ? '100%' : '133%',
          paddingLeft: isTutor ? 0 : 16,
          paddingRight: isTutor ? 0 : 16
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
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
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
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      
      {/* Conditionally render the "Add Lesson" tab based on isTutor */}
      {isTutor && (
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
            tabBarButton: (props) => <CustomTabBarButton {...props} />,
          }}
        />
      )}

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
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
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
