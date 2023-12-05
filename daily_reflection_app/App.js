import React from 'react';
import { View, StyleSheet } from 'react-native';
import MonthlySummaryChart from './Monthly';
// import D3Chart from './D3Chart';

const App = () => {
  // const data = [
  //   { month: '일월', value: 8 },
  //   { month: '이월', value: 7 },
  //   { month: '삼월', value: 9 },
  //   { month: '사월', value: 5 },
  //   { month: '오월', value: 6 },
  //   { month: '유월', value: 8 },
  //   { month: '칠월', value: 7 },
  //   { month: '팔월', value: 9 },
  //   { month: '구월', value: 8 },
  //   { month: '십월', value: 6 },
  //   { month: '십일월', value: 7 },
  //   { month: '십이월', value: 9 },
  //   // Add more as needed
  // ];

  const data1 = [
    { month: 'January', value: 8 },
    { month: 'February', value: 7 },
    { month: 'March', value: 9 },
    { month: 'April', value: 5 },
    { month: 'May', value: 6 },
    { month: 'June', value: 8 },
    { month: 'July', value: 7 },
    { month: 'August', value: 9 },
    { month: 'September', value: 8 },
    { month: 'October', value: 6 },
    { month: 'November', value: 7 },
    { month: 'December', value: 9 },
    // Add more as needed
  ];

  return (
    <View style={styles.container}>
      {/* <D3Chart data={data} width={300}/> */}
      <MonthlySummaryChart data={data} width={300}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10',
  },
});

export default App;
