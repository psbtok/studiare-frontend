import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/styles/Colors';
import words from '@/locales/ru';
import { Typography } from '@/styles/Typography';
import Button from './Button';
import commonStyles from '@/styles/CommonStyles';

export default function AgreementSwitch({ isAgreed, setIsAgreed }: { isAgreed: boolean; setIsAgreed: (value: boolean) => void }) {
  const [theme, setTheme] = useState('secondary') 
  const [icon, setIcon] = useState("close")
  const onPress = () => {
    setIsAgreed(!isAgreed)
    setTheme(!isAgreed ? 'primary' : "secondary")
    setIcon(!isAgreed ? 'checkmark-outline' : "close") 
  }
  return (
    <View style={styles.switchContainer}>
      <Button 
        onPress={onPress} 
        label={words.close}  
        hasIcon={true} 
        icon={icon} 
        theme={theme}
      ></Button>      
      <Text style={[commonStyles.label, {marginLeft: 12}]}>
        {isAgreed ? words.agreed : words.notAgreed}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  switchContainer: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 16,
    marginBottom: 16,
  },
  switchButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
  },
});