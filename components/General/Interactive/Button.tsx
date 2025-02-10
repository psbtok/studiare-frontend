import { StyleSheet, View, Pressable, Text, ViewStyle } from 'react-native';
import { Colors } from '@/styles/Colors';
import { Typography } from '@/styles/Typography';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  label: string;
  theme?: 'primary';
  onPress?: () => void;
  inline?: boolean;
  hasIcon?: boolean;
  icon?: string;
  disabled?: boolean; 
};

export default function Button({ label, theme, onPress, inline=true, hasIcon=false, icon="close", disabled }: Props) {
  const inlineStyle = inline ? styles.inlineContainer : {};

  const renderContent = hasIcon ? (
    <Ionicons name={icon} size={32} color={Colors.mediumGrey} />
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
    theme === 'primary' && { 
      backgroundColor: Colors.deepGrey,
      borderColor: Colors.deepGrey
    },
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
    backgroundColor: Colors.lightGrey
  },
  inlineContainer: {
    height: 53,
  },
  button: {
    borderRadius: 16,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: Colors.mediumGrey,
  },
  buttonLabel: {
    fontWeight: 'bold',
    color: Colors.mediumGrey,
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