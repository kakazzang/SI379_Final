import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Slider from '@react-native-community/slider';
import { NativeBaseProvider, Button } from 'native-base';
import { format } from 'date-fns';
import * as SQLite from 'expo-sqlite';

const ChatGPTDemo = () => {
  const [generatedQuestion, setGeneratedQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [regretLevel, setRegretLevel] = useState(3); // Initial regret level
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false); 

  // Open or create the database
  const db = SQLite.openDatabase('data.db');

  // Function to create the data table if not exists
  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql('DROP TABLE IF EXISTS data;', []);
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS data (date TEXT PRIMARY KEY, regretLevel INTEGER, userAnswer TEXT);',
        [],
        (tx, results) => {
          console.log('Table created successfully');

          // comment back if need to insert more data
          insertManualData(tx);
        },
        (tx, error) => {
          console.error('Error creating table:', error);
        }
      );
    });
  };

  const insertManualData = (tx) => {
    const manualData = [
      { date: '2023-11-23T00:00:00Z', regretLevel: 1, userAnswer: 'Answer 1' },
      { date: '2023-11-24T00:00:00Z', regretLevel: 2, userAnswer: 'Answer 2' },
      { date: '2023-11-25T00:00:00Z', regretLevel: 3, userAnswer: 'Answer 3' },
      { date: '2023-11-26T00:00:00Z', regretLevel: 4, userAnswer: 'Answer 4' },
      { date: '2023-11-27T00:00:00Z', regretLevel: 5, userAnswer: 'Answer 5' },
      { date: '2023-11-28T00:00:00Z', regretLevel: 4, userAnswer: 'Answer 6' },
      { date: '2023-11-29T00:00:00Z', regretLevel: 3, userAnswer: 'Answer 7' },
      { date: '2023-11-30T00:00:00Z', regretLevel: 2, userAnswer: 'Answer 8' },
      { date: '2023-12-01T00:00:00Z', regretLevel: 1, userAnswer: 'Answer 9' },
      { date: '2023-12-02T00:00:00Z', regretLevel: 2, userAnswer: 'Answer 10' },
      { date: '2023-12-03T00:00:00Z', regretLevel: 3, userAnswer: 'Answer 11' },
      // Add more entries as needed
    ];

    manualData.forEach((entry) => {
      
      tx.executeSql(
        'INSERT OR IGNORE INTO data (date, regretLevel, userAnswer) VALUES (?, ?, ?);',
        [entry.date, entry.regretLevel, entry.userAnswer],
        (tx, results) => {
          console.log(`Data for ${entry.date} inserted successfully`);
        },
        (tx, error) => {
          console.error(`Error inserting data for ${entry.date}:`, error);
        }
      );
    });
  };

  // Call createTable on component mount
  useEffect(() => {
    createTable();
  }, []);

  const generateRandomQuestion = async () => {
    setLoading(true);

    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const authData = require('./auth.json');
    const openaiApiKey = authData.openaiApiKey;

    const requestBody = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a poetic assistant, skilled in explaining complex programming concepts with creative flair.',
        },
        {
          role: 'user',
          content: 'Generate a random question for me about are you satisfied with what you did today/ how regret you are for the choices you make in today in less than 15 words and simple language.',
        },
      ],
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

          // comment back when need to refresh the question
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        const generatedMessage = data.choices[0].message.content;
        setGeneratedQuestion(generatedMessage);
      } else {
        console.error('Error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);

    }
  };

  const handleContainerPress = () => {
    Keyboard.dismiss();
  };

  const saveDataToSQLite = async () => {
    try {
      const currentDate = new Date();
      // const formattedDate = format(currentDate, 'yyyy-MM-dd');
      
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + 1);
      const formattedDate = nextDate.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
      console.log('Next day is: ', formattedDate);

      // Insert data into the SQLite database
      db.transaction(
        (tx) => {
          tx.executeSql(
            'INSERT OR REPLACE INTO data (date, regretLevel, userAnswer) VALUES (?, ?, ?);', [formattedDate, regretLevel, userAnswer],

            (tx, results) => {
              console.log('Data inserted successfully');
              setSubmitted(true);
            },
            (tx, error) => {
              console.error('Error inserting data:', error);
            }
          );

          // Retrieve all data from the SQLite database
          tx.executeSql(
            'SELECT * FROM data;',
            [],
            (_, { rows }) => {
              const data = {};

              for (let i = 0; i < rows.length; i++) {
                const row = rows.item(i);
                const formattedDate = format(new Date(row.date), 'yyyy-MM-dd');

                data[formattedDate] = {
                  regretLevel: row.regretLevel,
                  userAnswer: row.userAnswer,
                };
              }

              // Log the data object to the console
              console.log('Data in JSON format:', data);
            },
            (tx, error) => {
              console.error('Error selecting data:', error);
            }
          );
        },
        (error) => {
          console.error('Transaction error:', error);
        }
      );
    } catch (error) {
      console.error('Error saving data:', error.message);
    }
  };

  useEffect(() => {
    generateRandomQuestion();
  }, []);

  const renderTextInputAndSlider = () => {
    if (submitted) {
      return (
        <View style={{ marginTop: 10, opacity: 0.5 }}>
          {/* <Text style={styles.submittedText}>{userAnswer}</Text>
          <Text style={styles.submittedText}>Regret Level: {regretLevel}</Text> */}
        </View>
      );
    }

    return (
      <>
        <TextInput
          style={styles.input}
          placeholder="Type your answer here"
          onChangeText={(text) => setUserAnswer(text)}
          value={userAnswer}
          multiline={true} // Enable multiline
        />
        <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabelText}>Level of Regrets: {regretLevel}</Text>
        <Slider
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={regretLevel}
          onValueChange={(value) => setRegretLevel(value)}
          minimumTrackTintColor="#3BB0E5"
          maximumTrackTintColor="#CCCCCC"
          thumbTintColor="#3BB0E5"
        />
          <View style={styles.sliderLabels}>
            <Text>1</Text>
            <Text>2</Text>
            <Text>3</Text>
            <Text>4</Text>
            <Text>5</Text>
          </View>
        </View>
      </>
    );
  };

  const styles = StyleSheet.create({
    sliderLabelText: {
      fontSize: 18, // Set your desired font size
      // You can also add other styling properties like fontWeight, color, etc.
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    input: {
      height:200,
      borderColor: '#3BB0E5',
      borderWidth: 2,
      marginTop: 12,
      paddingHorizontal: 16,
      paddingTop:16,
      paddingBottom:16,
      width: '100%',
      borderRadius: 24,
      fontSize: 16,
      fontWeight: 'medium',
      lineHeight: 18,
    },
    sliderContainer: {
      width: '100%',
      marginTop: 20,
    },
    sliderLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      padding: 4,
    },
    submitButton: {
      width:"100%",
      height:48,
      marginTop: 20,
      backgroundColor: '#3BB0E5', // Material Design color
      borderRadius: 8, // Rounded corners
      paddingVertical: 10,
      paddingHorizontal: 12,
      elevation: 2, // Shadow for Android
      shadowColor: '#000', // Shadow for iOS
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 2,
      shadowOpacity: 0.25,
    },
    confirmationText: {
      marginTop: 20,
      fontWeight: 'bold',
      fontSize: 16, // Slightly larger font size
      color: '#4CAF50', // A color that indicates success
    },
    noteText: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlignVertical: 'top', 
      color:'white',
    },
    noteView: {
      width:'100%',
      height:150,
      paddingTop: 12,
      paddingBottom: 12,
      paddingLeft: 16,
      paddingRight: 16,
      backgroundColor: '#3BB0E5',
      borderRadius: 24,
      borderColor: '#bfebff',
      borderWidth: 2,
      shadowColor: '#2C2C2C',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    question:{
      width:'100%',
    }

  });

  return (
    <TouchableWithoutFeedback onPress={handleContainerPress}>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="medium" color="#3BB0E5" />
        ) : (
          <>
            <View style={styles.noteView}>
              <Text style={styles.noteText}>{generatedQuestion}</Text>
              </View>
            {renderTextInputAndSlider()}
            {submitted ? (
              <Text style={styles.confirmationText}>Today's thought is stored!</Text>
            ) : (
              <Button
                style={styles.submitButton}
                onPress={() => {
                  saveDataToSQLite();
                  console.log('User Answer:', userAnswer, 'Regret Level:', regretLevel);
                }}
              >
                <Text style={{ color: 'white', fontWeight: '500', fontSize:17, }}>Submit</Text>
              </Button>
            )}
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const PromptScreen = () => {
  return (
    <NativeBaseProvider>
      <ChatGPTDemo />
    </NativeBaseProvider>
  );
};

export default PromptScreen;
