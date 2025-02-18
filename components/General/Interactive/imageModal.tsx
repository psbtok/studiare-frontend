import React from 'react';
import { Modal, View, Image, StyleSheet } from 'react-native';
import Button from '@/components/General/Interactive/Button';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import { Dimensions } from 'react-native'

interface ImageModalProps {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
}
const imageSize = Dimensions.get('window').width * 0.9

const ImageModal = ({ visible, imageUri, onClose }: ImageModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
        <View style={styles.buttonContainer}>
            <Button theme="" label={words.close} onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.modalBackground,
    padding: 20,
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonContainer: {
    marginTop: 16,
    padding: 2,
    backgroundColor: Colors.paleGrey,
    borderRadius: 18
  }
});

export default ImageModal;
