import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
// import MonthlySummaryChart from './monthly';
import WeeklySummaryChart from './weekly';

// const Tab = createBottomTabNavigator();
const Tab = createMaterialTopTabNavigator();

const SummaryNavigation = () => {
  return (
    <NavigationContainer>
        <Tab.Navigator
            screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Monthly') {
                iconName = 'calendar';
                } else if (route.name === 'Weekly') {
                iconName = 'calendar-o';
                }

                const tabColor = focused ? '#3BB0E5' : 'gray';

                return (
                <View>
                    <Icon name={iconName} size={size} color={tabColor} />
                </View>
                );
            },
            })}
            tabBarOptions={{
            activeTintColor: '#3BB0E5',
            inactiveTintColor: 'gray',
            indicatorStyle: {
                backgroundColor: '#3BB0E5', // Sliding line color
            },
            labelStyle: {
                fontSize: 16,
                fontWeight: 'bold',
            },
            style: {
                borderTopWidth: 0,
                marginTop: 10,
                borderRadius: 10,
            },
            tabStyle: {
                backgroundColor: 'white', // Background color of each tab
            },
            }}
        >
            <Tab.Screen name="Monthly" component={MonthlySummaryChart} />
            <Tab.Screen name="Weekly" component={WeeklySummaryChart} />
        </Tab.Navigator>
        </NavigationContainer>
    );
    };

export default SummaryNavigation;

//     <NavigationContainer>
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;

//           if (route.name === 'Monthly') {
//             iconName = 'calendar';
//           } else if (route.name === 'Weekly') {
//             iconName = 'calendar-o';
//           }

//           // Set color based on whether the tab is focused
//           const tabColor = focused ? '#3BB0E5' : 'gray'; // Change colors as needed

//           return (
//             <View>
//               <Icon name={iconName} size={size} color={tabColor} />
//             </View>
//           );
//         },
//         tabBarStyle: {
//             borderTopWidth: 0,
//             marginTop: 10,
//             borderRadius: 10,
//             // Other styling properties...
//           },
//           headerTitleAlign: 'left',
//           headerTitleStyle: {
//           fontSize: 24,
//           backgroundColor: "white",
//           },
//           iconName:{
//             color:"#3BB0E5"
//           }
//         })}
//     >
//       <Tab.Screen name="Monthly" component={MonthlySummaryChart} />
//       <Tab.Screen name="Weekly" component={WeeklySummaryChart} />
//     </Tab.Navigator>
//     </NavigationContainer>
//   );
// };
