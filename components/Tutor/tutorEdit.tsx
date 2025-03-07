import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
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
  };
  onUpdateTutor: (updatedTutor: any) => void;
}

const TutorEdit = ({ tutor, onUpdateTutor }: TutorEditProps) => {
  const [about, setAbout] = useState<string>(tutor.about);
  const [education, setEducation] = useState<string>(tutor.education);
  const [links, setLinks] = useState<string>(tutor.links);
  const [birthDate, setBirthDate] = useState<Date>(tutor.birth_date ? new Date(tutor.birth_date) : new Date());
  const [experienceYears, setExperienceYears] = useState<number>(tutor.experienceYears || 0);
  const [paymentMethod, setPaymentMethod] = useState<string>(tutor.paymentMethod);
  const [resetDate, setResetDate] = useState(false);

  const defaultDate = tutor.birth_date ? new Date(tutor.birth_date) : new Date()

  const handleChange = (field: string, value: any) => {
    if (field === 'about') setAbout(value);
    if (field === 'education') setEducation(value);
    if (field === 'links') setLinks(value);
    if (field === 'experienceYears') setExperienceYears(value);
    if (field === 'paymentMethod') setPaymentMethod(value);

    if (tutor && tutor[field] !== value) {
      onUpdateTutor({ ...tutor, [field]: value });
    }
  };

  const handleDateChange = (date: Date) => {
    const currentDate = new Date();
    let age = currentDate.getFullYear() - date.getFullYear();
    const monthDifference = currentDate.getMonth() - date.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < date.getDate())) {
      age--;
    }

    if (age < 18) {
      Alert.alert(words.error, words.youShouldBeEighteen);
      setBirthDate(date);
      handleResetDate()
    } else {
      handleChange('birth_date', date.toISOString().split('T')[0]);
      setBirthDate(date);
    }
  };

  const handleResetDate = () => {
    setResetDate(true);
    setTimeout(() => {
      setResetDate(false); 
    }, 0);
  };

  return (
    <View style={styles.container}>
      <Text style={commonStyles.label}>{words.about}</Text>
      <TextInput
        style={commonStyles.input}
        placeholder={words.about}
        placeholderTextColor={Colors.mediumGrey}
        value={about}
        maxLength={256}
        onChangeText={(text) => handleChange('about', text)}
      />

      <Text style={commonStyles.label}>{words.education}</Text>
      <TextInput
        style={commonStyles.input}
        placeholder={words.education}
        placeholderTextColor={Colors.mediumGrey}
        value={education}
        maxLength={128}
        onChangeText={(text) => handleChange('education', text)}
      />

      <Text style={commonStyles.label}>{words.paymentMethod}</Text>
      <TextInput
        style={commonStyles.input}
        placeholder={words.paymentMethod}
        placeholderTextColor={Colors.mediumGrey}
        value={paymentMethod}
        maxLength={128}
        onChangeText={(text) => handleChange('paymentMethod', text)}
      />

      <Text style={commonStyles.label}>{words.birthDate}</Text>
      <DatePicker
        onDateChange={handleDateChange} 
        defaultDate={defaultDate}
        resetDate={resetDate}
      />

      <Text style={commonStyles.label}>{words.experienceYears}</Text>
      <NumberPicker
        value={experienceYears}
        step={1}
        min={0}
        max={100}
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
