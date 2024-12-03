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
    fontSize: Typography.fontSizes.m,
    color: Colors.deepGrey,
    marginBottom: 8,
    fontWeight: 'bold'
  },
  priceLabel: {
    textAlign: 'right',
    paddingVertical: 4,
    paddingHorizontal: 12,
    fontSize: Typography.fontSizes.m,
    fontWeight: 'bold',
    borderRadius: 12,
    color: Colors.lightGrey,
    backgroundColor: Colors.deepGrey,
  }
});

export default commonStyles;
