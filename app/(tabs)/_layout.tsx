import React from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableWithoutFeedback, View, StyleSheet, GestureResponderEvent } from 'react-native';
import Header from '@/components/General/Header/Header';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';

function CustomTabBarButton({ children, onPress }: { children: React.ReactNode, onPress?: (event: GestureResponderEvent) => void }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.tabButton}>{children}</View>
    </TouchableWithoutFeedback>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.darkBlue,
        tabBarStyle: {
          backgroundColor: Colors.paleGrey,
          height: 56,
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
        tabBarButton: (props) => <CustomTabBarButton {...props} />,
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
