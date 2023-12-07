import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Button } from 'react-native';
import MonthlySummaryChart from './Monthly'; // Assuming this is your Weekly Chart component
import WeeklySummaryChart from './weekly'; // Assuming this is your Monthly Chart component
import * as SQLite from 'expo-sqlite';
import { Icon } from 'react-native-elements';
import { startOfWeek, endOfWeek, addWeeks, startOfMonth, endOfMonth, addMonths, format } from 'date-fns';

const DataScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [chartType, setChartType] = useState('weekly'); // 'weekly' or 'monthly'

  // Open or create the database
  const db = SQLite.openDatabase('data.db');

  // Fetch data from the database
  useEffect(() => {
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

    fetchDataFromDatabase();
  }, []);

  // Filter data based on the current week or month
  const filterData = () => {
    if (chartType === 'weekly') {
      const weekStartDate = startOfWeek(currentWeek);
      const weekEndDate = endOfWeek(currentWeek);
      return data.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= weekStartDate && itemDate <= weekEndDate;
      });
    } else {
      const monthStartDate = startOfMonth(currentMonth);
      const monthEndDate = endOfMonth(currentMonth);
      return data.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= monthStartDate && itemDate <= monthEndDate;
      });
    }
  };

  // Change week or month
  const changePeriod = (amount) => {
    if (chartType === 'weekly') {
      setCurrentWeek(addWeeks(currentWeek, amount));
    } else {
      setCurrentMonth(addMonths(currentMonth, amount));
    }
  };

  // Loading indicator
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Filtered data for the chart
  const filteredData = filterData();

  return (
    <View style={styles.container}>
      <View style={styles.navigationContainer}>
        <Button title="Weekly" onPress={() => setChartType('weekly')} />
        <Button title="Monthly" onPress={() => setChartType('monthly')} />
      </View>
      <View style={styles.dateNavigationContainer}>
        <Icon name="chevron-left" type="feather" onPress={() => changePeriod(-1)} />
        <Text style={styles.dateText}>
          {chartType === 'weekly'
            ? `Week of ${format(startOfWeek(currentWeek), 'MMM do')}`
            : `Month of ${format(startOfMonth(currentMonth), 'MMM yyyy')}`}
        </Text>
        <Icon name="chevron-right" type="feather" onPress={() => changePeriod(1)} />
      </View>
      <View style={styles.chartContainer}>
        {chartType === 'weekly'
          ? <MonthlySummaryChart data={filteredData} />
          : <WeeklySummaryChart data={filteredData} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  dateNavigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DataScreen;
