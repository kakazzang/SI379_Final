import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');

  // Sample data for notes
  const notes = {
    '2023-11-30': 'Meeting with team at 10 AM. Discuss project roadmap.'
    // Add more notes here if needed
  };

  // Function to handle date selection
  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <Calendar
        onDayPress={onDayPress}
        markedDates={{
          '2023-11-30': { marked: true }
        }}
      />
      {selectedDate && notes[selectedDate] && (
        <View style={styles.noteView}>
          <Text style={styles.noteText}>{notes[selectedDate]}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  noteView: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  noteText: {
    fontSize: 16,
  }
});

export default CalendarScreen;
