import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CalendarScreen from './calendar';
import PromptScreen from './prompt';
import MonthlySummaryChart from './monthly';
import WeeklySummaryChart from './weekly';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const SummaryNavigation = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Monthly') {
          iconName = 'calendar';
        } else if (route.name === 'Weekly') {
          iconName = 'calendar-o';
        }

        // Set color based on whether the tab is focused
        const tabColor = focused ? '#3BB0E5' : 'gray'; // Change colors as needed

        return (
          <View>
            <Icon name={iconName} size={size} color={tabColor} />
          </View>
        );
      },
      tabBarStyle: {
        borderTopWidth: 0,
        marginTop: 10,
        borderRadius: 10,
        // Other styling properties...
      },
    })}
  >
    <Tab.Screen name="Monthly" component={MonthlySummaryChart} />
    <Tab.Screen name="Weekly" component={WeeklySummaryChart} />
  </Tab.Navigator>
);

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={TabNavigation} // Replace with your actual component for the home screen
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Data"
          component={SummaryNavigation}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
