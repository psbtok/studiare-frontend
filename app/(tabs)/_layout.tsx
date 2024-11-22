import React from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Header from '@/components/Header';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';

export default function TabLayout() {
  return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.skyBlue,
          tabBarStyle: {
            backgroundColor: Colors.paleGrey,
          },
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
            tabBarIcon: ({ color }) => (
              <Ionicons name='home-outline' color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="lessonCreate"
          options={{
            title: words.createLesson,
            tabBarIcon: ({ color }) => (
              <Ionicons
                name='add-circle-outline'
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: words.profile,
            tabBarIcon: ({ color }) => (
              <Ionicons
                name={'person-outline'}
                color={color}
                size={24}
              />
            ),
          }}
        />
      </Tabs>
  );
}
