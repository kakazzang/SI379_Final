import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import MonthlySummaryChart from './monthly';
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
      <View style={styles.chart}>
      <MonthlySummaryChart data={weeklyData} />
      </View>
    </View>
  );
};

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