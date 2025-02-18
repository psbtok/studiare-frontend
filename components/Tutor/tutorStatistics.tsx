import React, { useState, useEffect } from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native'; 
import { getMonthlyIncomeService } from '@/services/balanceService';
import { Colors } from '@/styles/Colors';
import { Typography } from '@/styles/Typography';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import words from '@/locales/ru';

const TutorStatistics = () => {
  const [totalIncome, setTotalIncome] = useState<number | null>(null);
  const [transactionCount, setTransactionCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const monthName = format(new Date(), 'LLLL', { locale: ru });

  useEffect(() => {
    const fetchMonthlyIncome = async () => {
      try {
        const { total_income, transaction_count } = await getMonthlyIncomeService();
        setTotalIncome(total_income);
        setTransactionCount(transaction_count);
      } catch (err) {
        setError('Failed to fetch monthly income data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonthlyIncome();
  }, []);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.month}>{words.monthlyStats} {monthName}</Text>
      <Text style={styles.text}>{words.totalIncome}: <Text style={styles.value}>{totalIncome} {words.currency}</Text></Text>
      <Text style={styles.text}>{words.lessonsConducted}: <Text style={styles.value}>{transactionCount}</Text></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: Colors.lightGrey,
    padding: 12,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  month: {
    fontSize: Typography.fontSizes.l,
    color: Colors.deepGrey,
    fontWeight: '500'
  },
  text: {
    fontSize: Typography.fontSizes.m,
    color: Colors.deepGrey,
  },
  value: {
    fontWeight: '500'
  }
});

export default TutorStatistics;
