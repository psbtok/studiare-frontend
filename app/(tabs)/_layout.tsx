import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Header from '@/components/Header';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';

export default function TabLayout() {
  return (
    <NavigationContainer>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.skyBlue,
          tabBarStyle: {
            backgroundColor: Colors.paleGrey,
          },
          header: ({ route }) => {
            const titles: Record<string, string> = {
              index: '',
              lotCreate: '',
              profile: words.profile,
            };
            const showEditButton = route.name === 'profile';
            return (
              <Header
                title={titles[route.name]}
                showBackButton={false}
                showEditButton={showEditButton}
              />
            );
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <Ionicons name='home-outline' color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="lotCreate"
          options={{
            title: 'Lot Create',
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
            title: 'Profile',
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
    </NavigationContainer>
  );
}
