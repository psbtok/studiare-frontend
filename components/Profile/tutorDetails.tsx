import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Colors } from '@/styles/Colors';
import commonStyles from '@/styles/CommonStyles';
import words from '@/locales/ru';
import { Typography } from '@/styles/Typography';

interface TutorDetailsProps {
  tutor: {
    id?: number;
    about?: string;
    birth_date?: string; 
    education?: string;
    links?: string;
    experienceYears?: number; 
  } | null;
}

const calculateAge = (birthDate: string): number | null => {
  if (!birthDate) return null;

  const birth = new Date(birthDate);
  const now = new Date();

  const age = now.getFullYear() - birth.getFullYear();
  const isBeforeBirthdayThisYear =
    now.getMonth() < birth.getMonth() || 
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());

  return isBeforeBirthdayThisYear ? age - 1 : age;
};

const getYearsLabel = (y: number): string => {
  if (!y && y !== 0) return ''; // Пустая строка, если y не передано
  return /\d*1\d$/.test(y.toString()) || /[05-9]$/.test(y.toString())
    ? 'лет'
    : /1$/.test(y.toString())
    ? 'год'
    : 'года';
};

const TutorDetails = ({ tutor }: TutorDetailsProps) => {
  if (!tutor) {
    return (
      <View style={styles.tutorDetails}>
        <Text style={[commonStyles.label, styles.tutorLabel]}>{words.tutorDetails}:</Text>
        <Text style={styles.notFilled}>{words.notAvailable}</Text>
      </View>
    );
  }

  const linksArray = tutor.links ? tutor.links.split(',').map(link => link.trim()) : [];
  const age = tutor.birth_date ? calculateAge(tutor.birth_date) : null;

  const handleOpenLink = (link: string) => {
    const formattedLink = link.startsWith('http') ? link : `https://${link}`;
    Linking.openURL(formattedLink).catch(err => console.error('Не удалось открыть URL', err));
  };

  return (
    <View style={styles.tutorDetails}>
      <Text style={[commonStyles.label, styles.tutorLabel]}>{words.tutorDetails}:</Text>

      <Text style={styles.info}>
        <Text style={commonStyles.label}>{words.about}: </Text>
        {tutor.about ? tutor.about : <Text style={styles.notFilled}>{words.notFilled}</Text>}
      </Text>

      <Text style={styles.info}>
        <Text style={commonStyles.label}>{words.experience}: </Text>
        {tutor.experienceYears !== null && tutor.experienceYears !== undefined ? (
          `${tutor.experienceYears} ${getYearsLabel(tutor.experienceYears)}`
        ) : (
          <Text style={styles.notFilled}>{words.notFilled}</Text>
        )}
      </Text>

      <Text style={styles.info}>
        <Text style={commonStyles.label}>{words.age}: </Text>
        {age !== null ? `${age} ${getYearsLabel(age)}` : <Text style={styles.notFilled}>{words.notFilled}</Text>}
      </Text>

      <Text style={styles.info}>
        <Text style={commonStyles.label}>{words.education}: </Text>
        {tutor.education ? tutor.education : <Text style={styles.notFilled}>{words.notFilled}</Text>}
      </Text>

      <View style={styles.info}>
        <Text style={commonStyles.label}>{words.links}: </Text>
        {linksArray.length > 0 ? (
          <View style={styles.linksContainer}>
            {linksArray.map((link, index) => (
              <TouchableOpacity key={index} onPress={() => handleOpenLink(link)}>
                <Text style={styles.link} numberOfLines={1} ellipsizeMode="tail">
                  {link}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.notFilled}>{words.notFilled}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tutorDetails: {
    marginTop: 20,
    padding: 10,
    backgroundColor: Colors.paleGrey,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.mediumGrey,
    width: '100%',
  },
  tutorLabel: {
    fontSize: Typography.fontSizes.s,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: Typography.fontSizes.s,
    color: Colors.deepGrey,
    marginBottom: 8,
  },
  linksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  link: {
    color: Colors.deepGrey,
    textDecorationLine: 'underline',
    marginRight: 10,
  },
  notFilled: {
    color: Colors.mediumGrey,
  },
});

export default TutorDetails;
