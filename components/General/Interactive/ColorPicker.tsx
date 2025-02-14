import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/styles/Colors';
import { subjectColors } from '@/styles/Colors';

interface ColorPickerProps {
  onSelect: (id: number) => void;
  selectedColorId: number | null;
}

function ColorPicker({ onSelect, selectedColorId }: ColorPickerProps) {
  const circleSize = 30;
  const selectedCircleSize = 40;

  return (
    <View style={styles.colorPickerContainer}>
      {subjectColors.map((color, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onSelect(index + 1)}
          style={styles.colorWrapper}
        >
          <View
            style={[
              styles.colorCircle,
              selectedColorId === index + 1 && styles.selectedCircle,
              { backgroundColor: color },
            ]}
          />
          {selectedColorId === index + 1 && (
            <View style={styles.selectionLine} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  colorPickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  colorWrapper: {
    alignItems: 'center',
    margin: 4,
  },
  colorCircle: {
    borderRadius: 50,
    width: 30,
    height: 30,
  },
  selectedCircle: {
    top: 4,
    width: 40,
    height: 40,
  },
  selectionLine: {
    top: 4,
    width: '80%',
    height: 4,
    backgroundColor: Colors.stoneGrey,
    opacity: 0.5,
    marginTop: 4, 
    borderRadius: 4, 
  },
});

export default ColorPicker;