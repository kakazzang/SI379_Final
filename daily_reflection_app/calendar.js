import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import * as SQLite from 'expo-sqlite';
import { format } from 'date-fns';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [notes, setNotes] = useState({});

  // Open or create the database
  const db = SQLite.openDatabase('data.db');

  // Function to fetch notes from the database
  const fetchNotesFromDatabase = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT date, userAnswer, regretLevel FROM data WHERE userAnswer IS NOT NULL;',
        [],
        (tx, results) => {
          const newNotes = {};

          for (let i = 0; i < results.rows.length; i++) {
            const row = results.rows.item(i);
            const formattedDate = format(new Date(row.date), 'yyyy-MM-dd');
            newNotes[formattedDate] = {
              userAnswer: row.userAnswer,
              regretLevel: row.regretLevel,
            };
          }

          setNotes(newNotes);
        },
        (tx, error) => {
          console.error('Error fetching notes:', error);
        }
      );
    });
  };

  useEffect(() => {
    fetchNotesFromDatabase();
  }, []); // Fetch notes on component mount

  // Function to handle date selection
  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  // Generate marked dates for the calendar
  const getMarkedDates = () => {
    let markedDates = {};

    // Populate marked dates with user answer and regret level
    Object.keys(notes).forEach((date) => {
      markedDates[date] = {
        marked: true,
        selected: selectedDate === date,
        selectedColor: 'lightblue', // You can change the color as needed
        customStyles: {
          container: {
            backgroundColor: 'lightblue',
          },
          text: {
            color: 'black',
          },
        },
        text: `${notes[date].userAnswer}\nRegret Level: ${notes[date].regretLevel}`,
      };
    });

    return markedDates;
  };

  return (
    <View>
      <Calendar onDayPress={onDayPress} markedDates={getMarkedDates()} />
      {selectedDate && notes[selectedDate] ? (
        <View style={styles.noteView}>
          <Text style={styles.noteText}>User Answer: {notes[selectedDate].userAnswer}</Text>
          <Text style={styles.noteText}>Regret Level: {notes[selectedDate].regretLevel}</Text>
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
  },
});

export default CalendarScreen;


