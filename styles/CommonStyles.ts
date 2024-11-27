import { StyleSheet } from 'react-native';
import { Colors } from './Colors';
import { Typography } from './Typography';

const commonStyles = StyleSheet.create({
  input: {
    paddingLeft: 16,
    color: Colors.mediumGrey,
    borderColor: Colors.mediumGrey,
    backgroundColor: Colors.lightGrey,
    borderWidth: 2,
    height: 52,
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: Typography.fontSizes.s,
    color: Colors.deepGrey,
    marginBottom: 8,
    fontWeight: 'bold'
  } 
});

export default commonStyles;
