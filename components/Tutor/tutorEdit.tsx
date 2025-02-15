import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import commonStyles from '@/styles/CommonStyles';
import words from '@/locales/ru';
import TutorLinksEdit from './tutorLinksEdit';
import DatePicker from '../General/Interactive/DatePicker';
import { Colors } from '@/styles/Colors';
import NumberPicker from '../General/Interactive/NumberPicker';

interface TutorEditProps {
  tutor: {
    id: number;
    about: string;
    birth_date: string;
    education: string;
    links: string;
    experienceYears: number;
    paymentMethod: string;
  } | null;
  onUpdateTutor: (updatedTutor: any) => void;
}

const TutorEdit = ({ tutor, onUpdateTutor }: TutorEditProps) => {
  const [about, setAbout] = useState<string>('');
  const [education, setEducation] = useState<string>('');
  const [links, setLinks] = useState<string>('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [experienceYears, setExperienceYears] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  useEffect(() => {
    if (tutor) {
      setAbout(tutor.about);
      setEducation(tutor.education);
      setLinks(tutor.links);
      setBirthDate(tutor.birth_date ? new Date(tutor.birth_date) : null);
      setExperienceYears(tutor.experienceYears || 0);
      setPaymentMethod(tutor.paymentMethod)
    }
  }, [tutor]);

  const handleChange = (field: string, value: any) => {
    if (field === 'about') setAbout(value);
    if (field === 'education') setEducation(value);
    if (field === 'links') setLinks(value);
    if (field === 'birth_date') setBirthDate(value);
    if (field === 'experienceYears') setExperienceYears(value);
    if (field === 'paymentMethod') setPaymentMethod(value);

    if (tutor && tutor[field] !== value) {
      onUpdateTutor({ ...tutor, [field]: value });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={commonStyles.label}>{words.about}</Text>
      <TextInput
        style={commonStyles.input}
        placeholder={words.about}
        placeholderTextColor={Colors.mediumGrey}
        value={about}
        onChangeText={(text) => handleChange('about', text)}
      />

      <Text style={commonStyles.label}>{words.education}</Text>
      <TextInput
        style={commonStyles.input}
        placeholder={words.education}
        placeholderTextColor={Colors.mediumGrey}
        value={education}
        onChangeText={(text) => handleChange('education', text)}
      />

      <Text style={commonStyles.label}>{words.paymentMethod}</Text>
      <TextInput
        style={commonStyles.input}
        placeholder={words.paymentMethod}
        placeholderTextColor={Colors.mediumGrey}
        value={paymentMethod}
        onChangeText={(text) => handleChange('paymentMethod', text)}
      />

      <Text style={commonStyles.label}>{words.birthDate}</Text>
      {birthDate && <DatePicker
        onDateChange={(date) => handleChange('birth_date', date.toISOString().split('T')[0])}
        defaultDate={birthDate}
      />}

      <Text style={commonStyles.label}>{words.experienceYears}</Text>
      <NumberPicker
        value={experienceYears}
        step={1}
        onValueChange={(value) => {
          if (value !== experienceYears) {
            handleChange('experienceYears', value);
          }
        }}
      />

      <TutorLinksEdit
        links={links}
        onUpdateLinks={(updatedLinks) => handleChange('links', updatedLinks)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
});

export default TutorEdit;
