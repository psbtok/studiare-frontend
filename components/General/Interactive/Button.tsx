import { StyleSheet, View, Pressable, Text, ViewStyle } from 'react-native';
import { Colors } from '@/styles/Colors';
import { Typography } from '@/styles/Typography';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  label: string;
  theme?: 'primary';
  onPress?: () => void;
  inline?: boolean;
  isClosing?: boolean;
  disabled?: boolean; 
};

export default function Button({ label, theme, onPress, inline, isClosing, disabled }: Props) {
  const inlineStyle = inline ? styles.inlineContainer : {};

  const renderContent = isClosing ? (
    <Ionicons name="close" size={32} color={Colors.deepGrey} />
  ) : (
    <Text
      style={[
        styles.buttonLabel,
        theme === 'primary' && { color: Colors.paleGrey },
        disabled && styles.disabledText,
      ]}
    >
      {label}
    </Text>
  );

  const buttonStyle = [
    styles.button,
    theme === 'primary' && { backgroundColor: Colors.deepGrey },
    disabled && styles.disabledButton,
  ];

  return (
    <View style={[styles.buttonContainer, inlineStyle]}>
      <Pressable
        style={buttonStyle}
        onPress={onPress}
        disabled={disabled}
      >
        {renderContent}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  inlineContainer: {
    height: 52,
  },
  button: {
    borderRadius: 16,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 3,
    borderColor: Colors.deepGrey,
  },
  buttonLabel: {
    fontWeight: 'bold',
    color: Colors.deepGrey,
    fontSize: Typography.fontSizes.s,
    marginBottom: 2,
  },
  disabledButton: {
    backgroundColor: Colors.lightGrey, 
    borderColor: Colors.mediumGrey, 
  },
  disabledText: {
    color: Colors.mediumGrey, 
  },
});