import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [notes, setNotes] = useState({});
  const [currentNote, setCurrentNote] = useState('');

  // Function to handle date selection
  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    setCurrentNote(notes[day.dateString] || '');
  };

  // Function to save the note
  const saveNote = () => {
    setNotes({
      ...notes,
      [selectedDate]: currentNote
    });
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
      <TextInput
        style={styles.input}
        value={currentNote}
        onChangeText={setCurrentNote}
        placeholder="Write a note..."
        multiline
      />
      <Button title="Save Note" onPress={saveNote} />
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
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginVertical: 10,
    height: 100
  }
});

export default CalendarScreen;