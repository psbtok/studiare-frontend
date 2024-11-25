import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '@/styles/Colors';
import commonStyles from '@/styles/CommonStyles';
import { AntDesign } from '@expo/vector-icons';
import words from '@/locales/ru';

interface NumberPickerProps {
  enterNumberText: string;
//   onValueChange: (value: number) => void;
}

export default function NumberPicker({
    enterNumberText //   onValueChange,
}: NumberPickerProps) {
  const [value, setValue] = useState(100); // Initial value

  const handleValueChange = (increment: boolean) => {
    setValue((prevValue) => {
      const newValue = increment ? prevValue + 100 : prevValue - 100;
      const validValue = Math.max(0, newValue);
    //   onValueChange(validValue); // Notify parent about the change
      return validValue;
    });
  };

  const handleTextInputChange = (text: string) => {
    const numericValue = Number(text);
    if (!isNaN(numericValue)) {
      setValue(numericValue);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.durationContainer}>
        <TextInput
          style={[commonStyles.input, styles.input]}
          placeholder={enterNumberText}
          placeholderTextColor={Colors.mediumGrey}
          value={value.toString()} 
          keyboardType="numeric" 
          onChangeText={handleTextInputChange}
        />
        <TouchableOpacity onPress={() => handleValueChange(false)}>
          <AntDesign name="minus" size={36} color={Colors.deepGrey} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleValueChange(true)}>
          <AntDesign name="plus" size={36} color={Colors.deepGrey} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.paleGrey,
    borderRadius: 16,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {

  }
});