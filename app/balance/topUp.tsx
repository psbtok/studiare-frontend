import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '@/styles/Colors';
import { Typography } from '@/styles/Typography';
import NumberPicker from '@/components/General/Interactive/NumberPicker';
import commonStyles from '@/styles/CommonStyles';
import words from '@/locales/ru';
import Button from '@/components/General/Interactive/Button';
import { useRouter } from 'expo-router';
import { getBalanceService, topUpService } from '@/services/balanceService';

const BalanceTopUp = () => {
  const [amount, setAmount] = useState<number>(1000);
  const [currentBalance, setCurrentBalance] = useState<number | null>(null); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null); 
  const [topUpError, setTopUpError] = useState<string | null>(null);
  const router = useRouter();

  const handleAmountChange = (newAmount: number) => {
    setAmount(newAmount);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balance = await getBalanceService();
        setCurrentBalance(balance);
      } catch (err: any) {
        setError('Failed to fetch balance');
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  const handleTopUp = async () => {
    setTopUpError(null);
    try {
      await topUpService(amount);
      router.replace('/(tabs)/profile');
    } catch (err: any) {
      setTopUpError('Failed to top up balance');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.deepGrey} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const newBalance = currentBalance ? currentBalance + amount : amount;

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.balanceContainer}>
          <Text style={[styles.balanceText, styles.currency]}>{words.currency}</Text>
          <Text style={styles.balanceText}>{currentBalance}</Text>
          <Text style={styles.arrow}>→</Text>
          <Text style={styles.balanceText}>{newBalance}</Text>
        </View>

        <View style={styles.amountContainer}>
          <Text style={commonStyles.label}>{words.amount}</Text>
          <NumberPicker
            value={amount}
            step={100}
            onValueChange={handleAmountChange}
          />
        </View>
      </View>

      {topUpError && <Text style={styles.errorText}>{topUpError}</Text>}

      <View style={styles.buttonBlock}>
        <View style={[styles.buttonContainer, styles.buttonFirst]}>
          <Button label={words.back} onPress={() => router.back()} />
        </View>
        <View style={styles.buttonContainer}>
          <Button theme="primary" label={words.topUp} onPress={handleTopUp} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.paleGrey,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  amountContainer: {
    marginTop: 12,
  },
  balanceContainer: {
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: Colors.lightGrey,
    padding: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceText: {
    color: Colors.deepGrey,
    fontSize: Typography.fontSizes.xxl,
    fontWeight: '500',
  },
  currency: {
    marginRight: 4,
  },
  arrow: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: '500',
    marginHorizontal: 8,
  },
  buttonBlock: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    marginTop: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonFirst: {
    marginRight: 16,
    flex: 1,
  },
  buttonContainer: {
    flex: 1.5,
  },
  errorText: {
    color: Colors.alertRed,
    fontSize: Typography.fontSizes.l,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default BalanceTopUp;
