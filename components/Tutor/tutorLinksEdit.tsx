import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import commonStyles from '@/styles/CommonStyles';
import words from '@/locales/ru';
import { AntDesign } from '@expo/vector-icons';
import { Colors } from '@/styles/Colors';

interface TutorLinksEditProps {
  links: string;
  onUpdateLinks: (updatedLinks: string) => void;
}

const TutorLinksEdit = ({ links, onUpdateLinks }: TutorLinksEditProps) => {
  const [linksArray, setLinksArray] = useState<string[]>(new Array(5).fill(''));
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const initialLinksArray = links
      ? links.split(', ').map(link => link.trim()).filter(link => link !== '').concat('').slice(0, 5)
      : [''];
    setLinksArray(initialLinksArray);
  }, [links]);

  const handleChangeLink = (index: number, value: string) => {
    const updatedLinksArray = [...linksArray];
    updatedLinksArray[index] = value;
    
    const filteredLinks = updatedLinksArray.filter(link => link !== '');
    const finalLinksArray = [...filteredLinks, ''];
    
    setLinksArray(finalLinksArray);
    onUpdateLinks(finalLinksArray.join(', ').replace(/,\s*$/, '')); 
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinksArray = [...linksArray];
    updatedLinksArray[index] = ''; 

    const filteredLinks = updatedLinksArray.filter(link => link !== '');
    const finalLinksArray = [...filteredLinks, ''];
    
    setLinksArray(finalLinksArray);
    onUpdateLinks(finalLinksArray.join(', ').replace(/,\s*$/, '')); 
  };

  return (
    <View>
      <Text style={commonStyles.label}>{words.links}</Text>

      {linksArray.slice(0, 5).map((link, index) => (
        <View key={index} style={styles.linkItem}>
          <TextInput
            ref={el => inputRefs.current[index] = el}
            style={[commonStyles.input, styles.input]}
            placeholderTextColor={Colors.mediumGrey}
            placeholder={words.enterLink}
            value={link}
            onChangeText={value => handleChangeLink(index, value)}
            maxLength={128}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />
          <TouchableOpacity onPress={() => handleRemoveLink(index)} style={styles.removeButton}>
            <AntDesign name="minus" size={36} color={Colors.alertRed} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  linkItem: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  removeButton: {
    marginLeft: 8,
    marginBottom: 16
  },
  input: {
    flex: 1,
  },
});

export default TutorLinksEdit;
