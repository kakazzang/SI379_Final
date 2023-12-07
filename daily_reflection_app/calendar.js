import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');

  // Sample data for notes
  const notes = {
    '2023-11-30': 'When participants were in a happy mood, they processed information more globally compared to when they were in a sad mood.',
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
      paddingTop: 12,
      paddingBottom:12,
      paddingLeft: 16,
      paddingRight: 16,
      backgroundColor: 'white',
      borderRadius: 24,
      borderColor:'#3BB0E5',
      borderWidth: 1,
      shadowColor: '#2C2C2C',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    noteText: {
      fontSize: 14,
      fontWeight: 'medium',
      lineHeight: 18,
    },
    container:{
      flex: 1,
      backgroundColor:"white",
    }
  });

export default CalendarScreen;