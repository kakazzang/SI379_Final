import React from 'react';
import { View, StyleSheet } from 'react-native';
// import D3Chart from './D3Chart';

const App = () => {
  const data = [
    { name: 'Category A', value: 30 },
    { name: 'Category B', value: 40 },
    // Add more data as needed
  ];

  return (
    <View style={styles.container}>
      <D3Chart data={data} width={300} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
