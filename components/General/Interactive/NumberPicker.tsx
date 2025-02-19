import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { Colors } from '@/styles/Colors';
import commonStyles from '@/styles/CommonStyles';
import { AntDesign } from '@expo/vector-icons';

interface NumberPickerProps {
  value: number;           
  step: number;
  min?: number;            
  max?: number;            
  onValueChange: (value: number) => void; 
}

export default function NumberPicker({
  value,
  step,
  min = 1,                
  max = 1000,             
  onValueChange
}: NumberPickerProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value); 
  }, [value]);

  const handleValueChange = (increment: boolean) => {
    setInputValue((prevValue) => {
      const newValue = increment ? prevValue + step : prevValue - step;
      const clampedValue = Math.max(min, Math.min(max, newValue)); 
      onValueChange(clampedValue);  
      return clampedValue;
    });
  };

  const handleTextInputChange = (text: string) => {
    const numericValue = Number(text);
    if (!isNaN(numericValue)) {
      const clampedValue = Math.max(min, Math.min(max, numericValue)); 
      setInputValue(clampedValue);
      onValueChange(clampedValue);  
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[commonStyles.input, styles.input]}
        value={inputValue.toString()}
        keyboardType="numeric"
        onChangeText={handleTextInputChange}
        onSubmitEditing={() => Keyboard.dismiss()} 
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
