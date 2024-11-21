import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Header from '@/components/Header';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.linkBlue,
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
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="lotCreate"
        options={{
          title: 'Lot Create',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'add-circle' : 'add-circle-outline'}
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
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person-sharp' : 'person-outline'}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
