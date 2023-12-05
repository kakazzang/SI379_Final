import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarScreen = () => {
  // Placeholder data for November 30th
  const [selectedDate, setSelectedDate] = useState('');
  const [notes, setNotes] = useState({
    '2023-11-30': 'This is a placeholder note for November 30th.'
  });

  // Function to handle date selection
  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  // Function to display the selected date and its note
  const renderNote = () => {
    if (!selectedDate) return <Text>Select a date to see notes</Text>;

    const noteForDate = notes[selectedDate];
    return (
      <View>
        <Text style={styles.dateText}>Selected Date: {selectedDate}</Text>
        <Text style={styles.noteText}>
          {noteForDate ? noteForDate : 'No note for this date'}
        </Text>
      </View>
    );
  };

  // Generate marked dates for the calendar
  const markedDates = Object.keys(notes).reduce((acc, date) => {
    acc[date] = { marked: true };
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={markedDates}
      />
      {renderNote()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 40,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  noteText: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
  }
});

export default CalendarScreen;