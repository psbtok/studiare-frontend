import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import { Typography } from '@/styles/Typography';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function LessonInfoScreen() {
  const handleLinkPress = () => {
    Linking.openURL('https://example.com/terms-and-conditions');
  };

  const statusIcons = [
    {
      icon: <AntDesign name="checkcircle" size={22} color={Colors.deepGrey} />,
      name: words.statusConducted,
    },
    {
      icon: <AntDesign name="checkcircleo" size={22} color={Colors.deepGrey} />,
      name: words.statusConfirmed,
    },
    {
      icon: <AntDesign name="clockcircleo" size={22} color={Colors.deepGrey} />,
      name: words.statusAwaitingConfirmation,
    },
    {
      icon: <AntDesign name="closecircle" size={22} color={Colors.deepGrey} />,
      name: words.statusCancelled,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{words.agreementTitle}</Text>
        <Text style={styles.text}>
          {words.agreementInfo}
          <Text style={styles.link} onPress={handleLinkPress}>
            {words.agreementLink}
          </Text>
        </Text>

        <Text style={[styles.title, { marginTop: 40 }]}>{words.statusTitle}</Text>
        <View style={styles.statusContainer}>
          {statusIcons.map((status, index) => (
            <View key={index} style={styles.statusItem}>
              {status.icon}
              <Text style={styles.statusText}>{status.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.paleGrey,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'flex-start', 
  },
  title: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: 'bold',
    color: Colors.deepGrey,
    marginBottom: 12,
    textAlign: 'left',
  },
  text: {
    fontSize: Typography.fontSizes.m,
    color: Colors.deepGrey,
    textAlign: 'left',
  },
  link: {
    color: Colors.deepGrey,
    textDecorationLine: 'underline',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusItem: {
    width: '100%', 
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusText: {
    fontSize: Typography.fontSizes.m,
    color: Colors.deepGrey,
    marginLeft: 8,
  },
});
