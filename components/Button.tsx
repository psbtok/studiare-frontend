import { StyleSheet, View, Pressable, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors } from '@/constants/Colors';

type Props = {
  label: string;
  theme?: 'primary';
  onPress?: () => void;
};

export default function Button({ label, theme, onPress }: Props) {
  if (theme === 'primary') {
    return (
      <View
        style={[
          styles.buttonContainer
        ]}>
        <Pressable style={[styles.button, { backgroundColor: Colors.darkGrey }]} onPress={onPress}>
          <Text style={[styles.buttonLabel, { color: Colors.lightGrey }]}>{label}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={onPress} >
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16
  },
  button: {
    borderRadius: 16,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 3,
    borderColor: Colors.darkGrey
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: Colors.darkGrey,
    fontSize: 16,
  },
});