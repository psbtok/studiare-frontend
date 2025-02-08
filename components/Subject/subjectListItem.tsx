import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Subject } from '@/models/models';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import { Typography } from '@/styles/Typography';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

function SubjectListItem(props: { subject: Subject }) {
  const { subject } = props;

  const subjectColors = [
    Colors.subjectColor1,
    Colors.subjectColor2,
    Colors.subjectColor3,
    Colors.subjectColor4,
    Colors.subjectColor5,
    Colors.subjectColor6,
    Colors.subjectColor7,
    Colors.subjectColor8,
  ];

  const color = 
    subject.colorId && subject.colorId < 9 ?
    subjectColors[subject.colorId] :
    Colors.lightGrey;

  return (
    <TouchableOpacity
      style={[styles.subjectItem, { borderLeftColor: color }]}
      onPress={() => { }}
    >
      <View style={styles.subjectHeader}>
        <Text style={styles.subjectTitle}>{subject.title} {subject.colorId}</Text>
      </View>

      {subject.notes && (
        <Text style={styles.subjectNotes} numberOfLines={2}>
          {subject.notes}
        </Text>
      )}

      {subject.price && (
        <View style={styles.priceContainer}>
          <MaterialIcons name="attach-money" size={18} color={Colors.deepGrey} />
          <Text style={styles.priceText}>{subject.price} {words.currency}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  subjectItem: {
    minWidth: '100%',
    backgroundColor: Colors.paleGrey,
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 6,
    shadowColor: Colors.deepGrey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 4,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectTitle: {
    fontSize: Typography.fontSizes.l,
    fontWeight: 'bold',
    color: Colors.deepGrey,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: 8,
  },
  subjectNotes: {
    fontSize: Typography.fontSizes.m,
    color: Colors.mediumGrey,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: Typography.fontSizes.m,
    color: Colors.deepGrey,
    marginLeft: 4,
  },
});

export default SubjectListItem;