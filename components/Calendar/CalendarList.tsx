import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import CalendarListItem from './CalendarListItem'; // Ensure correct path

export default function CalendarList() {
  const [days, setDays] = useState<{ day: string; date: string }[]>([]);
  
  useEffect(() => {
    const generateUpcomingDays = () => {
      const today = new Date();
      const upcomingDays = [];
      
      for (let i = 0; i < 14; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        const day = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
        const date = currentDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
        
        upcomingDays.push({ day, date });
      }
      
      setDays(upcomingDays);
    };

    generateUpcomingDays();
  }, []);

  return (
    <ScrollView style={styles.scrollView}>
      {days.map((dayItem, index) => (
        <CalendarListItem key={index} day={dayItem.day} date={dayItem.date} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
  },
});
