import React from "react";

import { LocationProvider } from "./src/context/LocationContext";

import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import MapScreen from "./src/screens/MapScreen";
import CameraScreen from "./src/screens/CameraScreen";
import SaveScreen from "./src/screens/SaveScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <LocationProvider>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: "black" },
            headerTitleStyle: { color: "white" },
            headerTintColor: "white",
          }}
          initialRouteName="Map"
        >
          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen name="Camera" component={CameraScreen} />
          <Stack.Screen name="save" component={SaveScreen} />
        </Stack.Navigator>
      </LocationProvider>
    </NavigationContainer>
  );
}
