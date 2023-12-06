import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');

  // Sample data for notes
  const notes = {
    '2023-11-30': 'Meeting with team at 10 AM.',
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
        selectedColor: '#3BB0E5' // You can change the color as needed
      };
    }

    return markedDates;
  };

  return (
    <View style={styles.container}>
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
      marginTop: 16,
      padding: 12,
      backgroundColor: 'white',
      borderRadius: 5,
      borderColor:'#F9F8F8',
      borderWidth: 1,
      shadowColor: '#F9F8F8',
      shadowOffset: { width: 2, height: 1 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
    },
    noteText: {
      fontSize: 14,
    },
    container:{
      flex: 1,
      backgroundColor:"white",
    }
  });

export default CalendarScreen;