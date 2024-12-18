import { StyleSheet, View, Pressable, Text, ViewStyle } from 'react-native';
import { Colors } from '@/styles/Colors';
import { Typography } from '@/styles/Typography';

type Props = {
  label: string;
  theme?: 'primary';
  onPress?: () => void;
  inline?: boolean;
};

export default function Button({ label, theme, onPress, inline }: Props) {
  const inlineStyle = inline ? styles.inlineContainer : {};

  if (theme === 'primary') {
    return (
      <View style={[styles.buttonContainer, inlineStyle]}>
        <Pressable style={[styles.button, { backgroundColor: Colors.deepGrey }]} onPress={onPress}>
          <Text style={[styles.buttonLabel, { color: Colors.paleGrey }]}>{label}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.buttonContainer, inlineStyle]}>
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonLabel}>{label}</Text>
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
    height: 52
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
});
