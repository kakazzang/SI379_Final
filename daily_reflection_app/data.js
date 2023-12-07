import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import MonthlySummaryChart from './Monthly'; // This is weekly 
import WeeklySummaryChart from './weekly'; // This is monthly
import * as SQLite from 'expo-sqlite';
import { startOfWeek, endOfWeek, addWeeks, format } from 'date-fns';

const DataScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Open or create the database
  const db = SQLite.openDatabase('data.db');

  // Function to fetch data from the database
  const fetchDataFromDatabase = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT date, regretLevel FROM data;',
        [],
        (tx, results) => {
          const newData = [];

          for (let i = 0; i < results.rows.length; i++) {
            const row = results.rows.item(i);
            newData.push({
              date: row.date,
              regretLevel: row.regretLevel,
            });
          }
          setData(newData);
          setLoading(false);
        },
        (tx, error) => {
          console.error('Error fetching data:', error);
        }
      );
    });
  };

  useEffect(() => {
    fetchDataFromDatabase();
  }, []);

  const filterDataForWeek = (data, weekStartDate) => {
    const weekEndDate = endOfWeek(weekStartDate);
    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= weekStartDate && itemDate <= weekEndDate;
    });
  };

  const changeWeek = (numberOfWeeks) => {
    setCurrentWeek(addWeeks(currentWeek, numberOfWeeks));
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const weeklyData = filterDataForWeek(data, startOfWeek(currentWeek));

  return (
    <View style={styles.container}>
      <View style={styles.navigationContainer}>
        <Icon
          name="chevron-left"
          type="feather"
          onPress={() => changeWeek(-1)}
          size={30}
          color="#3BB0E5"
        />
        <Text style={styles.weekText}>Week of {format(startOfWeek(currentWeek), 'MMM do')}</Text>
        <Icon
          name="chevron-right"
          type="feather"
          onPress={() => changeWeek(1)}
          size={30}
          color="#3BB0E5"
        />
      </View>
      <MonthlySummaryChart data={weeklyData} /> 
      {/* <WeeklySummaryChart data={monthlyData} /> */}
      </View> 
    ) 
  }

const styles = StyleSheet.create({
  chart:{
    flex:1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  weekText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  navigationContainer: {
    marginTop:60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
});

export default DataScreen;

// NEW CODE HERE // NEW CODE HERE// NEW CODE HERE// NEW CODE HERE// NEW CODE HERE// NEW CODE HERE// NEW CODE HERE// NEW CODE HERE// NEW CODE HERE// NEW CODE HERE// NEW CODE HERE
// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
// import { Icon } from 'react-native-elements';
// // import MonthlySummaryChart from './Monthly'; // This is weekly 
// import WeeklySummaryChart from './weekly'; // This is monthly
// import * as SQLite from 'expo-sqlite';
// import { startOfMonth, endOfMonth, addMonths, format } from 'date-fns'; // NEW

// const DataScreen = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentMonth, setCurrentMonth] = useState(new Date()); // NEW

//   // Open or create the database
//   const db = SQLite.openDatabase('data.db');

//   // Function to fetch data from the database
//   const fetchDataFromDatabase = () => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         'SELECT date, regretLevel FROM data;',
//         [],
//         (tx, results) => {
//           const newData = [];

//           for (let i = 0; i < results.rows.length; i++) {
//             const row = results.rows.item(i);
//             newData.push({
//               date: row.date,
//               regretLevel: row.regretLevel,
//             });
//           }
//           setData(newData);
//           setLoading(false);
//         },
//         (tx, error) => {
//           console.error('Error fetching data:', error);
//         }
//       );
//     });
//   };

//   useEffect(() => {
//     fetchDataFromDatabase();
//   }, []);

//   const filterDataForMonth = (data, monthStartDate) => {
//     const monthEndDate = endOfMonth(monthStartDate);
//     return data.filter(item => {
//       const itemDate = new Date(item.date);
//       return itemDate >= monthStartDate && itemDate <= monthEndDate;
//     });
//   };
//   // NEW

//   const changeMonth = (numberOfMonths) => {
//     setCurrentMonth(addMonths(currentMonth, numberOfMonths));
//   };
//   // NEW

//   const calculateAverageForMonth = (monthly_data) => {
//     if (monthly_data.length === 0) {
//       return 0;
//     }

//   const totalRegret = monthlyData.reduce((sum, item) => sum + item.regretLevel, 0);
//     return totalRegret / monthlyData.length;
//   };

//   if (loading) {
//     return <ActivityIndicator size="large" color="#0000ff" />;
//   }

//   const monthlyData = filterDataForMonth(data, startOfMonth(currentMonth)); // NEW
//   const averageRegretForMonth = calculateAverageForMonth(monthlyData);

//   return (
//     <View style={styles.container}>
//       <View style={styles.navigationContainer}>
//         {/* <Icon
//           name="chevron-left"
//           type="feather"
//           onPress={() => changeMonth(-1)}
//           size={30}
//           color="#3BB0E5"
//         /> */}
//         {/* <Text style={styles.weekText}>
//           Month of {format(startOfMonth(currentMonth), 'MMM')}, Avg Regret: {averageRegretForMonth.toFixed(2)}
//           Monthly Average Regret Level
//         </Text> */}
//         {/* <Text style={styles.weekText}>Week of {format(startOfMonth(currentMonth), 'MMM do')}</Text> */}
//         {/* <Icon
//           name="chevron-right"
//           type="feather"
//           onPress={() => changeMonth(1)}
//           size={30}
//           color="#3BB0E5"
//         /> */}
//       </View>
//       <Text style={styles.weekText}>
//           Month of {format(startOfMonth(currentMonth), 'MMM')}, Avg Regret: {averageRegretForMonth.toFixed(2)}
//           {/* Monthly Average Regret Level */}
//         </Text>
//       {/* <View style={styles.chart}> */}
//       <View style={{ flex: 1, width: '100%', height: '100%' }}>
//         {/* <MonthlySummaryChart data={weeklyData} />  */}
//         <WeeklySummaryChart averageRegretForMonth={averageRegretForMonth} data={monthlyData} />
//       </View>
//     </View>
  
  
// )

// }

// const styles = StyleSheet.create({
//   chart:{
//     flex:1,
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'white',
//   },
//   weekText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginVertical: 10,
//   },
//   navigationContainer: {
//     marginTop:60,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//     marginBottom: 20,
//   },
// });

// export default DataScreen;

