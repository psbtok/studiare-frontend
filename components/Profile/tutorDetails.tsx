import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Colors } from '@/styles/Colors';
import commonStyles from '@/styles/CommonStyles';
import words from '@/locales/ru';

interface TutorDetailsProps {
  tutor: {
    id: number;
    about: string;
    birth_date: string;
    education: string;
    links: string; // Ссылка хранится как строка с запятыми
    age: number;
  };
}

const TutorDetails = ({ tutor }: TutorDetailsProps) => {
  // Разбиваем строку на отдельные ссылки
  const linksArray = tutor.links ? tutor.links.split(',').map(link => link.trim()) : [];

  const handleOpenLink = (link: string) => {
    const formattedLink = link.startsWith('http') ? link : `https://${link}`;
    Linking.openURL(formattedLink).catch((err) => console.error("Не удалось открыть URL", err));
  };

  return (
    <View style={styles.tutorDetails}>
      <Text style={[commonStyles.label, styles.tutorLabel]}>{words.tutorDetails}:</Text>
      
      {/* Показываем возраст только если он есть */}
      {tutor.age && (
        <Text style={styles.info}>
          <Text style={commonStyles.label}>{words.experience}: </Text>
          {tutor.age}
        </Text>
      )}

      {/* Показываем образование только если оно есть */}
      {tutor.education && (
        <Text style={styles.info}>
          <Text style={commonStyles.label}>{words.education}: </Text>
          {tutor.education}
        </Text>
      )}

      {/* Показываем описание только если оно есть */}
      {tutor.about && (
        <Text style={styles.info}>
          <Text style={commonStyles.label}>{words.about}: </Text>
          {tutor.about}
        </Text>
      )}

      {/* Показываем ссылки только если они есть */}
      {linksArray.length > 0 && (
        <Text style={styles.info}>
          <Text style={commonStyles.label}>{words.links}: </Text>
          <View style={styles.linksContainer}>
            {linksArray.map((link, index) => (
              <TouchableOpacity key={index} onPress={() => handleOpenLink(link)}>
                <Text style={styles.link} numberOfLines={1} ellipsizeMode="tail">
                  {link}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Text>
      )}
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
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
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
    marginBottom: 5,
  },
});

export default TutorDetails;
