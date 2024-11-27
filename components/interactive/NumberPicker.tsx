import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '@/styles/Colors';
import commonStyles from '@/styles/CommonStyles';
import { AntDesign } from '@expo/vector-icons';

interface NumberPickerProps {
  initialValue: number;
  step: number;
  onValueChange: (value: number) => void; 
}

export default function NumberPicker({
  initialValue,
  step,
  onValueChange
}: NumberPickerProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    onValueChange(value);
  }, [value, onValueChange]);

  const handleValueChange = (increment: boolean) => {
    setValue((prevValue) => {
      const newValue = increment ? prevValue + step : prevValue - step;
      return Math.max(0, newValue);
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
      <TextInput
        style={[commonStyles.input, styles.input]}
        value={value.toString()}
        keyboardType="numeric"
        onChangeText={handleTextInputChange}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleValueChange(false)}>
          <AntDesign name="minus" size={36} color={Colors.deepGrey} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleValueChange(true)}>
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  input: {
    flexGrow: 1
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    flexDirection: 'row'
  },
  button: {
    marginHorizontal: 8
  }
});
