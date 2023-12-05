import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Slider from '@react-native-community/slider';
import { NativeBaseProvider, Button } from 'native-base';
import * as FileSystem from 'expo-file-system';
import { format } from 'date-fns';

const ChatGPTDemo = () => {
  const [generatedQuestion, setGeneratedQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [regretLevel, setRegretLevel] = useState(3); // Initial regret level
  const [loading, setLoading] = useState(true);
  const authData = require('./auth.json');
  const openaiApiKey = authData.openaiApiKey;

  const generateRandomQuestion = async () => {
    setLoading(true);

    const apiUrl = 'https://api.openai.com/v1/chat/completions';

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

  const saveDataToFile = async () => {
    try {
      const currentDate = new Date();
      const formattedDate = format(currentDate, 'yyyy-MM-dd');

      // Check if 'data.json' exists
      const fileExists = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'data.json');
      let data = {};

      if (fileExists.exists) {
        // If the file exists, read its contents
        const fileContent = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'data.json');
        data = JSON.parse(fileContent);
      }

      // Update data with new values
      data[formattedDate] = {
        regretLevel,
        userAnswer,
      };

      // Write updated data back to 'data.json'
      await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + 'data.json', JSON.stringify(data));
      console.log('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error.message);
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
            <Button size = "lg" onPress={() => { saveDataToFile(); console.log('User Answer:', userAnswer, 'Regret Level:', regretLevel); }}>Submit</Button>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const Prompt = () => {
  return (
    <NativeBaseProvider>
      <ChatGPTDemo />
    </NativeBaseProvider>
  );
};

export default Prompt;
