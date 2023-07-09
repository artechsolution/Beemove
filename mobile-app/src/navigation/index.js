import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import AuthStack from "./AuthStack/AuthStack";
import MainStack from "./MainStack/MainStack";
import MainDrawer from "./MainDrawer/MainDrawer";

const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainStack" component={MainStack} />
        <Stack.Screen name="AuthStack" component={AuthStack} />
        <Stack.Screen name="MainDrawer" component={MainDrawer} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

const styles = StyleSheet.create({});
