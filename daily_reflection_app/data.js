import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import MonthlySummaryChart from './monthly';
import SummaryNavigation from './summarynav';

const App = () => {
  const data = [
  { date: "2023-11-28", regretLevel: 1 },
  { date: "2023-11-29", regretLevel: 2 },
  { date: "2023-11-30", regretLevel: 4 },
  { date: "2023-12-01", regretLevel: 3 },
  { date: "2023-12-02", regretLevel: 3 },
  { date: "2023-12-03", regretLevel: 5 },
  { date: "2023-12-04", regretLevel: 2 },
  { date: "2023-12-05", regretLevel: 3 },
  ];
  
  return (
    <View style={styles.container}>
      {/* <D3Chart data={data} width={300}/> */}
      {/* <MonthlySummaryChart data={data} width={300}/> */}
      {/* <StatusBar translucent backgroundColor="transparent" /> */}
      <MonthlySummaryChart data={data} />
      {/* <SummaryNavigation /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: '10',
  },
});

export default App;
