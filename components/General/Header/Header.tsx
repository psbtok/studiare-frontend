import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/styles/Colors';
import { logoutService } from '@/services/authService';
import words from '@/locales/ru';
import { Typography } from '@/styles/Typography';

const Header = ({ title, showLogoutButton=false, showAddSubject=false }: any) => {
  const router = useRouter();

  const handleAddSubject = () => {
    router.push('/subject/subjectCreate')
  }

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
      <Text style={styles.title}>{title}</Text>
      {showLogoutButton ? (
        <TouchableOpacity onPress={handleLogout} style={styles.iconContainer}>
          <Feather name="log-out" size={28} color={Colors.alertRed} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconContainer} />
      )}
      {showAddSubject && (
        <TouchableOpacity onPress={handleAddSubject} style={styles.iconContainer}>
          <AntDesign name="plus" size={32} color={Colors.mediumGrey} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.paleGrey,
  },
  title: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.deepGrey,
    textAlign: 'left',
    flex: 1,
  },
  iconContainer: {
    width: 40, 
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header;
