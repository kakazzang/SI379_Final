import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const ChatGPTDemo = () => {
  const [generatedQuestion, setGeneratedQuestion] = useState('');

  const generateRandomQuestion = async () => {
    const openaiApiKey = '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';
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
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <NativeBaseProvider>
        <Box>Hello world</Box>
      </NativeBaseProvider>
      <Text>Generated Question: {generatedQuestion}</Text>
      <Button title="Generate Random Question" onPress={generateRandomQuestion} />
      <StatusBar style="auto" />
    </View>
  );
};

export default ChatGPTDemo;

