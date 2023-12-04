import React from 'react';
import { View, StyleSheet } from 'react-native';
import MonthlySummaryChart from './Monthly';
// import D3Chart from './D3Chart';

const App = () => {
  const data = [
    { name: 'Satisfaction ', value: 30 },
    { name: 'Category B', value: 40 },
    { name: 'Category C', value: 40 },
    { name: 'Category D', value: 40 },
    { name: 'Category E', value: 40 },
    // Add more data as needed
  ];

  return (
    <View style={styles.container}>
      <D3Chart data={data} width={300}/>
      <MonthlySummaryChart data={data} width={300}/>
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
