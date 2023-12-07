import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text } from 'react-native';
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
            } else if (route.name === 'Summary') {
              iconName = 'bar-chart';
            }

            // Set color based on whether the tab is focused
            const tabColor = focused ? '#3BB0E5' : 'gray';

            return (
              <View>
                <Icon name={iconName} size={size} color={tabColor} />
              </View>
            );
          },
          tabBarLabel: ({ focused, color }) => {
            // Set color based on whether the tab is focused
            const labelColor = focused ? '#3BB0E5' : 'gray';
            return (
              <Text style={{ color: labelColor, fontSize: 12 }}>
                {route.name}
              </Text>
            );
          },
          tabBarStyle: {
            borderTopWidth: 0,
            marginTop: 10,
            borderRadius: 10,
          },
          headerTitleAlign: 'left',
          headerTitleStyle: {
            fontSize: 24,
            backgroundColor: "white",
          },
        })}
      >
        <Tab.Screen name="Prompt" component={PromptScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Summary" component={DataScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
