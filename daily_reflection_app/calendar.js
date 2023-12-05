import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');

  // Sample data for notes
  const notes = {
    '2023-11-30': 'Meeting with team at 10 AM. Discuss project roadmap.',
    // Add more notes here if needed
  };

  // Function to handle date selection
  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  // Generate marked dates for the calendar
  const getMarkedDates = () => {
    let markedDates = {
      ...Object.keys(notes).reduce((acc, date) => {
        acc[date] = { marked: true };
        return acc;
      }, {}),
    };

    // Highlight the selected date
    if (selectedDate) {
      markedDates[selectedDate] = { 
        ...markedDates[selectedDate],
        selected: true, 
        selectedColor: 'lightblue' // You can change the color as needed
      };
    }

    return markedDates;
  };

  return (
    <View>
      <Calendar
        onDayPress={onDayPress}
        markedDates={getMarkedDates()}
      />
      {selectedDate && notes[selectedDate] ? (
        <View style={styles.noteView}>
          <Text style={styles.noteText}>{notes[selectedDate]}</Text>
        </View>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
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