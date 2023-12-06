import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Slider from '@react-native-community/slider';
import { NativeBaseProvider, Button } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

const ChatGPTDemo = () => {
  const [generatedQuestion, setGeneratedQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [regretLevel, setRegretLevel] = useState(3); // Initial regret level
  const [loading, setLoading] = useState(true);

  // Open or create the database
  const db = SQLite.openDatabase('data.db');

  const createTableAndOpenDB = () => {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS data (date TEXT PRIMARY KEY, regretLevel INTEGER, userAnswer TEXT);',
            [],
            (tx, results) => {
              console.log('Table created successfully');
              resolve();
            },
            (tx, error) => {
              console.error('Error creating table:', error);
              reject(error);
            }
          );
        },
        (error) => {
          console.error('Error in transaction:', error);
          reject(error);
        },
        () => {
          // Success callback (optional)
          console.log('Transaction completed successfully');
        }
      );
    });
  };

  // Call createTableAndOpenDB on component mount
  useEffect(() => {
    (async () => {
      try {
        await createTableAndOpenDB();
        // ... (other code)
      } catch (error) {
        console.error('Error opening database:', error);
      }
    })();
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
          content: 'Generate a random question for me about dairy in less than 15 words.',
        },
      ],
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      const currentDate = format(new Date(), 'yyyy-MM-dd');
  
      // Insert data into the SQLite database
      await new Promise((resolve, reject) => {
        db.transaction(
          (tx) => {
            tx.executeSql(
              'INSERT OR REPLACE INTO data (date, regretLevel, userAnswer) VALUES (?, ?, ?);',
              [currentDate, regretLevel, userAnswer],
              (_, results) => {
                console.log('Data inserted successfully');
                resolve();
              },
              (_, error) => {
                console.error('Error inserting data:', error);
                reject(error);
              }
            );
          },
          (error) => {
            console.error('Error in transaction:', error);
            reject(error);
          }
        );
      });
  
      await writeDataToJson();
      console.log('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error.message);
    }
  };
  
  const writeDataToJson = async () => {
    try {
      const data = {};
  
      // Retrieve all data from the SQLite database
      await new Promise((resolve, reject) => {
        db.transaction(
          (tx) => {
            tx.executeSql(
              'SELECT * FROM data;',
              [],
              (_, results) => {
                const rows = results.rows;
  
                for (let i = 0; i < rows.length; i++) {
                  const row = rows.item(i);
                  const formattedDate = format(new Date(row.date), 'yyyy-MM-dd');
  
                  data[formattedDate] = {
                    regretLevel: row.regretLevel,
                    userAnswer: row.userAnswer,
                  };
                }
  
                resolve();
              },
              (_, error) => {
                console.error('Error selecting data:', error);
                reject(error);
              }
            );
          },
          (error) => {
            console.error('Error in transaction:', error);
            reject(error);
          }
        );
      });
  
      // Write data to 'data.json'
      const filePath = `${FileSystem.documentDirectory}data.json`;
      await FileSystem.writeAsStringAsync(filePath, JSON.stringify(data), { encoding: FileSystem.EncodingType.UTF8 });
  
      console.log('Data written to data.json successfully:', data);

      // Log the contents of 'data.json' after writing
      // const fileContent = await FileSystem.readAsStringAsync(filePath);
      // console.log('Content of data.json after writing:', fileContent);

    } catch (error) {
      console.error('Error writing data to data.json:', error.message);
    }
  };

  useEffect(() => {
    generateRandomQuestion();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginTop: 10,
      padding: 10,
      width: '100%',
    },
    sliderContainer: {
      width: '100%',
      marginTop: 20,
    },
  });

  return (
    <TouchableWithoutFeedback onPress={handleContainerPress}>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Text>Generated Question: {generatedQuestion}</Text>
            <TextInput
              style={styles.input}
              placeholder="Type your answer here"
              onChangeText={(text) => setUserAnswer(text)}
              value={userAnswer}
            />
            <View style={styles.sliderContainer}>
              <Text>Level of Regrets: {regretLevel}</Text>
              <Slider
                minimumValue={1}
                maximumValue={5}
                step={1}
                value={regretLevel}
                onValueChange={(value) => setRegretLevel(value)}
              />
            </View>
            <Button size="lg" onPress={() => {saveDataToSQLite(); console.log('User Answer:', userAnswer, 'Regret Level:', regretLevel);}}>Submit</Button>
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
