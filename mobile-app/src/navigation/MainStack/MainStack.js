import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
// import Home from '../../screens/Auth/Main/Home/Home'
import Home from "../../screens/Main/Home/Home";
import RideScreen from "../../screens/Main/Ride/RideScreen";
import CarScreen from "../../screens/Main/Car/CarScreen";
import PadalaScreen from "../../screens/Main/Padala/PadalaScreen";
import PabiliScreen from "../../screens/Main/Pabili/PabiliScreen";
import BookPadala from "../../screens/Main/Padala/BookPadala/BookPadala";
import CompleteJob from "../../screens/Main/CompleteJob/CompleteJob";
import MyBookings from "../../screens/Main/MyBookings/MyBookings";
import PaymentScreen from "../../screens/Main/Payment/PaymentScreen";
import Receipt from "../../screens/Main/Receipt/Receipt";
import ConvertToDriver from "../../screens/Main/ConvertToDriver/ConvertToDriver";
const Stack = createStackNavigator();

const MainStack = () => {
  return(

  

    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={"PaymentScreen"}
    >
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="RideScreen" component={RideScreen} />
      <Stack.Screen name="CarScreen" component={CarScreen} />
      <Stack.Screen name="PadalaScreen" component={PadalaScreen} />
      <Stack.Screen name="BookPadala" component={BookPadala} />
      <Stack.Screen name="PabiliScreen" component={PabiliScreen} />
      <Stack.Screen name="CompleteJob" component={CompleteJob} />
      <Stack.Screen name="MyBookings" component={MyBookings} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="Receipt" component={Receipt} />
      <Stack.Screen name="ConvertToDriver" component={ConvertToDriver} />
    </Stack.Navigator>
  );
};

export default MainStack;
