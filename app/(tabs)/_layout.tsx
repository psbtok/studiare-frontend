import React, { useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import Header from '@/components/General/Header/Header';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider } from 'react-redux';
import { store } from '../store/store';

function TabLayoutComponent() {
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
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.darkBlue,
          tabBarStyle: {
            backgroundColor: Colors.paleGrey,
            height: 56,
            width: isTutor ? '100%' : '167%',
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
              subject: words.subject
            };
            const showLogoutButton = route.name === 'profile';
            const showAddSubject = route.name === 'subject';
            return (
              <Header
                title={titles[route.name]}
                showLogoutButton={showLogoutButton}
                showAddSubject={showAddSubject}
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
        
        {isTutor && (
          <Tabs.Screen
            name="subject"
            options={{
              title: words.subject,
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? 'book' : 'book-outline'}
                  color={color}
                  size={28}
                />
              ),
              tabBarButton: (props) => <CustomTabBarButton {...props} />,
            }}
          />
        )}

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
    </View>
  );
}

export default function TabLayout() {
  return (
    <Provider store={store}>
      <TabLayoutComponent />
    </Provider>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
