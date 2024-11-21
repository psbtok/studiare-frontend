import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/styles/Colors';
import { logoutService } from '@/app/services/authService';
import words from '@/locales/ru';

const Header = ({ title, showBackButton = false, showEditButton = false }: any) => {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      words.confirmLogoutTitle,
      words.confirmLogoutMessage,
      [
        {
          text: words.cancel,
          style: 'cancel',
        },
        {
          text: words.logout,
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutService();
              router.replace('/auth/welcome');
            } catch (error) {
              console.error(words.logoutFailed, error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.header}>
      {showBackButton ? (
        <TouchableOpacity onPress={() => router.back()} style={styles.iconContainer}>
          <Ionicons name="arrow-back" size={28} color={Colors.deepGrey} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconContainer} />
      )}
      <Text style={styles.title}>{title}</Text>
      {showEditButton ? (
        <TouchableOpacity onPress={handleLogout} style={styles.iconContainer}>
          <Feather name="log-out" size={28} color={Colors.alertRed} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconContainer} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.paleGrey,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.deepGrey,
    textAlign: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40, 
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    color: '#000',
    padding: 8,
  },
});

export default Header;
