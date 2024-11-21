import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { createLotService } from '@/app/services/lotService';
import { Colors } from '@/styles/Colors';

export default function CreateLotScreen() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    starting_price: '',
    is_reserve: false,
    reserve_price: '',
    start_datetime: new Date(),
    end_datetime: new Date(),
    image: null,
  });

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, image: result.assets[0] });
    }
  };

  const handleSubmit = async () => {
    try {
      const startDatetime = form.start_datetime.toISOString();
      const endDatetime = form.end_datetime.toISOString();

      const startingPrice = parseFloat(form.starting_price); // Преобразуем в число
      const reservePrice = form.is_reserve ? parseFloat(form.reserve_price) : 0; // Преобразуем в число или undefined

      // Проверка на валидность значений
      if (isNaN(startingPrice)) {
        Alert.alert('Error', 'Starting price must be a valid number.');
        return;
      }

      if (form.is_reserve && isNaN(reservePrice)) {
        Alert.alert('Error', 'Reserve price must be a valid number if reserved.');
        return;
      }

      const lotData = {
        title: form.title,
        description: form.description,
        starting_price: startingPrice, // Передаем число
        is_reserve: form.is_reserve,
        reserve_price: reservePrice, // Передаем число или undefined
        start_datetime: startDatetime,
        end_datetime: endDatetime,
        image: form.image ? {
          uri: form.image.uri,
          type: form.image.type || 'image/jpeg',
          fileName: form.image.fileName || 'image.jpg',
        } : undefined,
      };

      const response = await createLotService(lotData);
      Alert.alert('Success', 'Lot created successfully!');
    } catch (error) {
      console.error('Error creating lot:', error);
      Alert.alert('Error', 'Failed to create lot. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Lot</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={form.title}
        onChangeText={(text) => setForm({ ...form, title: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={form.description}
        onChangeText={(text) => setForm({ ...form, description: text })}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Starting Price"
        keyboardType="numeric"
        value={form.starting_price}
        onChangeText={(text) => setForm({ ...form, starting_price: text })}
      />

      <View style={styles.checkboxContainer}>
        <Text style={styles.checkboxLabel}>Is Reserve</Text>
        <Button
          title={form.is_reserve ? "Yes" : "No"}
          onPress={() => setForm({ ...form, is_reserve: !form.is_reserve })}
        />
      </View>

      {form.is_reserve && (
        <TextInput
          style={styles.input}
          placeholder="Reserve Price"
          keyboardType="numeric"
          value={form.reserve_price}
          onChangeText={(text) => setForm({ ...form, reserve_price: text })}
        />
      )}

      {/* <View>
        <Text style={styles.label}>Start Date</Text>
        <DateTimePicker
          value={form.start_datetime}
          mode="datetime"
          display="default"
          onChange={(event, date) => date && setForm({ ...form, start_datetime: date })}
        />
      </View>

      <View>
        <Text style={styles.label}>End Date</Text>
        <DateTimePicker
          value={form.end_datetime}
          mode="datetime"
          display="default"
          onChange={(event, date) => date && setForm({ ...form, end_datetime: date })}
        />
      </View> */}

      <TouchableOpacity onPress={handleImageUpload} style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>
          {form.image ? "Change Image" : "Upload Image"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Create Lot</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.paleGrey,
  },
  title: {
    fontSize: 24,
    color: '#ffd33d',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkboxLabel: {
    color: '#fff',
    marginRight: 10,
  },
  label: {
    color: '#fff',
    marginTop: 10,
  },
  uploadButton: {
    backgroundColor: '#ffd33d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  uploadButtonText: {
    color: Colors.paleGrey,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#ffd33d',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: Colors.paleGrey,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
