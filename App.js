
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Home from "./screens/Dashboard";
import FullMatch from "./screens/FullMatch"
import Cycles from "./screens/Cycles";
import Activity from "./screens/Activity";
import Autos from "./screens/Autos";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Dashboard" component={Home} />
        <Drawer.Screen name="Full Match" component={FullMatch} />
        <Drawer.Screen name="Cycles" component={Cycles} />
        <Drawer.Screen name="Activity" component={Activity} />
        <Drawer.Screen name="Autos" component={Autos} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
