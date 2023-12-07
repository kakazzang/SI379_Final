import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CalendarScreen from './calendar';
import PromptScreen from './prompt';
import DataScreen from './data';

const Tab = createBottomTabNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Prompt') {
              iconName = 'edit';
            } else if (route.name === 'Calendar') {
              iconName = 'calendar';
            } else if (route.name === 'Data') {
              iconName = 'bar-chart';
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
          headerTitleAlign: 'left',
          headerTitleStyle: {
          fontSize: 24,
          backgroundColor: "white",
          },
          iconName:{
            color:"#3BB0E5"
          }
        })}
      >
        <Tab.Screen name="Prompt" component={PromptScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Data" component={DataScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
