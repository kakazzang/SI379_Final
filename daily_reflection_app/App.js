import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import AppNavigation from './navigation';

const App = () => {
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <AppNavigation />
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    marginTop: 48,
    // justifyContent: 'center',
  },
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

export default App;

