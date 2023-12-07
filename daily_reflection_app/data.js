
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import MonthlySummaryChart from './monthly'; // This is weekly 
import WeeklySummaryChart from './weekly'; // This is monthly
import * as SQLite from 'expo-sqlite';
import { startOfWeek, endOfWeek, addWeeks, format } from 'date-fns';
// import { startOfMonth, endOfMonth, addMonths, format } from 'date-fns'; // NEW

const DataScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  // const [currentMonth, setCurrentMonth] = useState(new Date()); // NEW

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

  // const filterDataForMonth = (data, monthStartDate) => {
  //   const monthEndDate = endOfMonth(monthStartDate);
  //   return data.filter(item => {
  //     const itemDate = new Date(item.date);
  //     return itemDate >= monthStartDate && itemDate <= monthEndDate;
  //   });
  // };
  // // NEW

  // const changeMonth = (numberOfMonths) => {
  //   setCurrentMonth(addMonths(currentMonth, numberOfMonths));
  // };
  // // NEW

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const weeklyData = filterDataForWeek(data, startOfWeek(currentWeek));
  // const monthlyData = filterDataForMonth(data, startOfMonth(currentMonth)); // NEW

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
      <View style={styles.chart}>
      <MonthlySummaryChart data={weeklyData} />
      {/* <WeeklySummaryChart data={monthlyData} /> */}
      </View>

      {/* <View style={styles.navigationContainer}>
        <Icon
          name="chevron-left"
          type="feather"
          onPress={() => changeMonth(-1)}
          size={30}
          color="#3BB0E5"
        />
        <Text style={styles.monthText}>{format(startOfMonth(currentMonth), 'MMMM yyyy')}</Text>
        <Icon
          name="chevron-right"
          type="feather"
          onPress={() => changeMonth(1)}
          size={30}
          color="#3BB0E5"
        />
      </View>
      <View style={styles.chart}>
        <MonthlySummaryChart data={monthlyData} />
      </View> */}
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