import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import commonStyles from '@/styles/CommonStyles';
import words from '@/locales/ru';
import TutorLinksEdit from './tutorLinksEdit';

interface TutorEditProps {
  tutor: {
    id: number;
    about: string;
    birth_date: string;
    education: string;
    links: string;
  } | null;
  onUpdateTutor: (updatedTutor: any) => void;
}

const TutorEdit = ({ tutor, onUpdateTutor }: TutorEditProps) => {
  const [about, setAbout] = useState<string>('');
  const [education, setEducation] = useState<string>('');
  const [links, setLinks] = useState<string>('');

  useEffect(() => {
    if (tutor) {
      setAbout(tutor.about);
      setEducation(tutor.education);
      setLinks(tutor.links);
    }
  }, [tutor]);

  // Обновление данных, включая ссылки
  const handleChange = (field: string, value: string) => {
    if (field === 'about') setAbout(value);
    if (field === 'education') setEducation(value);
    if (field === 'links') setLinks(value);
    onUpdateTutor({ ...tutor, [field]: value });
  };

  return (
    <View style={styles.container}>
      <Text style={commonStyles.label}>{words.about}</Text>
      <TextInput
        style={commonStyles.input}
        placeholder={words.about}
        value={about}
        onChangeText={(text) => handleChange('about', text)}
      />

      <Text style={commonStyles.label}>{words.education}</Text>
      <TextInput
        style={commonStyles.input}
        placeholder={words.education}
        value={education}
        onChangeText={(text) => handleChange('education', text)}
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
