import React from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Header from '@/components/General/Header/Header';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.deepGrey,
        tabBarStyle: {
          backgroundColor: Colors.paleGrey,
          paddingTop: 5,
        },
        tabBarShowLabel: false,
        header: ({ route }) => {
          const titles: Record<string, string> = {
            index: '',
            lessonCreate: words.lessonCreation,
            profile: words.profile,
          };
          const showLogoutButton = route.name === 'profile';
          return (
            <Header
              title={titles[route.name]}
              showBackButton={false}
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
              name={focused ? 'home' : 'home-outline'}
              color={color}
              size={26}
            />
          ),
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
              size={26}
            />
          ),
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
              size={26}
            />
          ),
        }}
      />
    </Tabs>
  );
}
