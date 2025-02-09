import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Subject } from '@/models/models';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import { Typography } from '@/styles/Typography';
import commonStyles from '@/styles/CommonStyles';
import { AntDesign } from '@expo/vector-icons';

function SubjectListItem(props: { subject: Subject }) {
  const { subject } = props;
  const router = useRouter();

  const subjectColors = [
    Colors.subjectColor0,
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
    subject.colorId && subject.colorId < 10
      ? subjectColors[subject.colorId - 1]
      : Colors.subjectColor0;

  return (
    <TouchableOpacity
      style={[styles.subjectItem, { borderLeftColor: color }]}
      onPress={() => {
        router.push({
          pathname: '/subject/subjectDetail',
          params: { subject: JSON.stringify(subject) },
        });
      }}
    >
      <View style={styles.subjectHeader}>
        <Text style={styles.subjectTitle} numberOfLines={1}>
          {subject.title}
        </Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.iconBlock}
            onPress={() => {
              router.push({
                pathname: '/subject/subjectEdit',
                params: { subject: JSON.stringify(subject) },
              });
            }}
          >
            <AntDesign name="edit" size={24} color={Colors.mediumGrey} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBlock}>
            <AntDesign name="plus" size={24} color={Colors.mediumGrey} />
          </TouchableOpacity>
        </View>
      </View>
      {subject.notes && (
        <Text style={styles.subjectNotes} numberOfLines={1}>
          {subject.notes}
        </Text>
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
  subjectNotes: {
    fontSize: Typography.fontSizes.m,
    color: Colors.mediumGrey,
    marginBottom: 8,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconBlock: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderColor: Colors.mediumGrey,
    borderRadius: 8,
    borderWidth: 2,
  },
});

export default SubjectListItem;