import React, { useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { Colors, ratingColors } from '@/styles/Colors';
import words from '@/locales/ru';
import Button from '@/components/General/Interactive/Button';
import { rateLessonService } from '@/services/lessonService';
import commonStyles from '@/styles/CommonStyles';
import { Typography } from '@/styles/Typography';

interface LessonRateModalProps {
  visible: boolean;
  onClose: () => void;
  lessonId: number; 
  onRate: (rating: number) => void; 
}

const LessonRateModal = ({ visible, onClose, lessonId, onRate }: LessonRateModalProps) => {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState<number | null>(null); 

  const handleSubmit = async () => {
    if (rating === null) {
      Alert.alert(words.error, words.selectRating);
      return;
    }

    setLoading(true);
    try {
      await rateLessonService(lessonId, rating);
      Alert.alert(words.success, words.ratingSubmitted);
      onRate(rating); // Invoke onRate with the submitted rating
      onClose();
    } catch (error: any) {
      Alert.alert(words.error, error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderRatingButtons = () => {
    return (
      <View style={styles.ratingContainer}>
        {Array.from({ length: 5 }, (_, index) => {
          const isSelected = rating === index + 1;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.ratingButton,
                {
                  borderWidth: isSelected ? 0 : 2,
                  borderColor: isSelected ? 'transparent' : Colors.deepGrey,
                  backgroundColor: isSelected ? ratingColors[4 - index] : Colors.paleGrey,
                },
              ]}
              onPress={() => setRating(index + 1)}
            >
              <Text style={{ 
                color: isSelected ? Colors.paleGrey : Colors.deepGrey, 
                fontWeight: '500',
                fontSize: 18,
              }}>
                {index + 1}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={[commonStyles.label, styles.label]}>{words.howWasTheLesson}</Text>
          {renderRatingButtons()} 
          <View style={styles.buttonContainer}>
            <View style={styles.buttonSmall}>
              <Button
                label={words.close}
                theme=""
                onPress={onClose}
              />
            </View>
            <View style={styles.buttonBig}>
              <Button
                label={loading ? words.loading : words.rate}
                theme={loading ? "secondary" : "primary"}
                onPress={handleSubmit}
                disabled={loading} 
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.modalBackground,
  },
  modalContent: {
    width: '80%',
    backgroundColor: Colors.paleGrey,
    borderRadius: 20,
    padding: 16
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  ratingButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20, 
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  buttonSmall: {
    flex: 1,
    marginRight: 12, 
  },
  buttonBig: {
    flex: 1.5,
  },
  label: {
    marginLeft: 8,
    fontSize: Typography.fontSizes.l
  }
});

export default LessonRateModal;
