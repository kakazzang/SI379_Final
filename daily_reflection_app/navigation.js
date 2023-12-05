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

            return (
              <View style>
                <Icon name={iconName} size={size} color={color} />
              </View>
            );
          },
          tabBarStyle: {
            // Add custom styles here
            borderTopWidth: 0,
            marginTop: 10, 
            borderRadius: 10, // Optional: if you want rounded corners
            // Other styling properties can be added here
          },
        })}
        tabBarOptions={{
          activeTintColor: 'lightblue',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Prompt" component={PromptScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Data" component={DataScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
