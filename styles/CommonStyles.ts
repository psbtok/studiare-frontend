import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

const commonStyles = StyleSheet.create({
  input: {
    paddingLeft: 16,
    color: Colors.mediumGrey,
    borderColor: Colors.mediumGrey,
    backgroundColor: Colors.lightGrey,
    borderWidth: 2,
    height: 64,
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
});

export default commonStyles;
