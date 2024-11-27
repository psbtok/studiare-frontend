import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import commonStyles from '@/styles/CommonStyles';
import words from '@/locales/ru';
import { AntDesign } from '@expo/vector-icons';
import { Colors } from '@/styles/Colors';

interface TutorLinksEditProps {
  links: string;
  onUpdateLinks: (updatedLinks: string) => void;
}

const TutorLinksEdit = ({ links, onUpdateLinks }: TutorLinksEditProps) => {
  const [currentLink, setCurrentLink] = useState<string>('');
  const [linksArray, setLinksArray] = useState<string[]>([]);

  // useEffect для установки начальных значений linksArray
  useEffect(() => {
    const initialLinksArray = links ? links.split(', ').filter(link => link.trim() !== '') : [];
    setLinksArray(initialLinksArray);
  }, [links]); // Завершаем useEffect на изменении links

  const handleAddLink = () => {
    if (currentLink.trim()) {
      const updatedLinksArray = [...linksArray, currentLink.trim()];
      setLinksArray(updatedLinksArray);
      onUpdateLinks(updatedLinksArray.join(', '));
      setCurrentLink(''); // Очищаем поле ввода после добавления
    }
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinksArray = linksArray.filter((_, i) => i !== index);
    setLinksArray(updatedLinksArray);
    onUpdateLinks(updatedLinksArray.join(', '));
  };

  const handleOpenLink = (link: string) => {
    const formattedLink = link.startsWith('http') ? link : `https://${link}`;
    Linking.openURL(formattedLink).catch((err) => console.error('Не удалось открыть URL', err));
  };

  return (
    <View>
      <Text style={commonStyles.label}>{words.links}</Text>

      <View style={styles.addLinkContainer}>
        <TextInput
          style={[commonStyles.input, styles.input]}
          placeholderTextColor={Colors.mediumGrey}
          placeholder={words.enterLink}
          value={currentLink}
          onChangeText={setCurrentLink}
          onSubmitEditing={handleAddLink} 
          returnKeyType="done"
        />

        <TouchableOpacity onPress={handleAddLink} style={styles.addButton}>
          <AntDesign name="plus" size={36} color={Colors.deepGrey} />
        </TouchableOpacity>
      </View>

      <View style={styles.linksList}>
        {linksArray.map((link, index) => (
          <View key={index} style={styles.linkItem}>
            <TouchableOpacity onPress={() => handleOpenLink(link)} style={styles.linkButton}>
              <Text
                style={[commonStyles.label, styles.link]}
                numberOfLines={1} 
                ellipsizeMode="tail"
              >
                {link}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRemoveLink(index)} style={styles.removeButton}>
              <AntDesign name="minus" size={36} color={Colors.deepGrey} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  linksList: {
    marginHorizontal: 8,
  },
  linkItem: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  linkButton: {
    flex: 1, 
  },
  removeButton: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
  },
  addLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  addButton: {
    marginLeft: 16,
    paddingBottom: 16,
  },
  link: {
    color: Colors.deepGrey,
    textDecorationLine: 'underline',
    flexShrink: 1,
  },
});

export default TutorLinksEdit;
