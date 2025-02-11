import { StyleSheet, View, Pressable, Text, ViewStyle } from 'react-native';
import { Colors } from '@/styles/Colors';
import { Typography } from '@/styles/Typography';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  label: string;
  theme?: 'primary' | string;
  onPress?: () => void;
  inline?: boolean;
  hasIcon?: boolean;
  icon?: string;
  disabled?: boolean;
};

export default function Button({ label, theme, onPress, inline = true, hasIcon = false, icon = "close", disabled }: Props) {
  const inlineStyle = inline ? styles.inlineContainer : {};

  const iconColor = theme === 'primary' ? Colors.paleGrey : Colors.mediumGrey;
  const iconBackground = theme === 'primary' ? Colors.deepGrey : 'transparent';
  const iconBorderColor = theme === 'primary' ? Colors.deepGrey : Colors.mediumGrey;

  const renderContent = hasIcon ? (
    <View style={[styles.iconContainer]}>
      <Ionicons name={icon} size={32} color={iconColor} />
    </View>
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
      borderColor: Colors.deepGrey,
    },
    hasIcon && {
      width: 53
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
    backgroundColor: Colors.lightGrey,
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
  iconContainer: {
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.lightGrey,
    borderColor: Colors.mediumGrey,
  },
  disabledText: {
    color: Colors.mediumGrey,
  },
});