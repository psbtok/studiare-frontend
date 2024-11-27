import { View, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { Colors } from '@/styles/Colors';
import { Typography } from '@/styles/Typography';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Not Found' }} />
      <View style={styles.container}>
        <Link href="/" style={styles.button}>
          Go back to Home screen!
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paleGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    fontSize: Typography.fontSizes.l,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});
