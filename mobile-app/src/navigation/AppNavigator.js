import React, { useEffect, useRef } from "react";
import { StatusBar } from "react-native";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  DriverRating,
  ProfileScreen,
  PaymentDetails,
  RideListPage,
  MapScreen,
  BookedCabScreen,
  RideDetails,
  SearchScreen,
  EditProfilePage,
  AboutPage,
  OnlineChat,
  WalletDetails,
  AddMoneyScreen,
  SelectGatewayPage,
  LoginScreen,
  DriverTrips,
  WithdrawMoneyScreen,
  DriverIncomeScreen,
  ConvertDriver,
  RegistrationPage,
  Notifications as NotificationsPage,
} from "../screens";
import { useSelector } from "react-redux";
import SideMenu from "../components/SideMenu";
import i18n from "i18n-js";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Home from "../screens/Main/Home/Home";
import LoginRegister from "../screens/Auth/LoginRegister/LoginRegister";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function AppContainer() {
  const isRTL =
    i18n.locale.indexOf("he") === 0 || i18n.locale.indexOf("ar") === 0;
  const auth = useSelector((state) => state.auth);
  const responseListener = useRef();
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const nData = response.notification.request.content.data;
        if (nData.screen) {
          if (nData.params) {
            navigationRef.navigate(nData.screen, nData.params);
          } else {
            navigationRef.navigate(nData.screen);
          }
        }
      });
  }, []);
  const DrawerRoot = () => {
    return (
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: Platform.OS == "android" ? false : true,
          drawerPosition: isRTL ? "right" : "left",
        }}
        drawerContent={(props) => <SideMenu {...props} />}
      >
        {auth.info &&
        auth.info.profile &&
        auth.info.profile.usertype == "rider" ? (
          <Drawer.Screen name="Map" component={Home} />
        ) : null}
        {auth.info &&
        auth.info.profile &&
        auth.info.profile.usertype == "rider" ? (
          <Drawer.Screen
          options={{
            drawerItemStyle:{display:"none"}}}
           name="SelectRide" component={MapScreen} />
        ) : null}
        {auth.info &&
        auth.info.profile &&
        auth.info.profile.usertype == "rider" ? (
          <Drawer.Screen name="Convert" component={ConvertDriver} />
        ) : null}
        {auth.info &&
        auth.info.profile &&
        auth.info.profile.usertype == "driver" ? (
          <Drawer.Screen name="DriverTrips" component={DriverTrips} />
        ) : null}
        {auth.info &&
        auth.info.profile &&
        auth.info.profile.usertype == "driver" ? (
          <Drawer.Screen name="MyEarning" component={DriverIncomeScreen} />
        ) : null}
        <Drawer.Screen name="RideList" component={RideListPage} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="About" component={AboutPage} />
        <Drawer.Screen name="Wallet" component={WalletDetails} />
        <Drawer.Screen name="Notifications" component={NotificationsPage} />
      </Drawer.Navigator>
    );
  };

  return (
    <NavigationContainer ref={navigationRef}>
      {/* <StatusBar hidden /> */}

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: Platform.OS == "android" ? false : true,
        }}
      >
        {auth.info && auth.info.profile ? (
          <Stack.Group options={{ headerShown: false }}>
            <Stack.Screen name="DrawerRoot" component={DrawerRoot} />
            <Stack.Screen name="editUser" component={EditProfilePage} />
            <Stack.Screen name="MapScreen" component={MapScreen} />

            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="DriverRating" component={DriverRating} />
            <Stack.Screen name="PaymentDetails" component={PaymentDetails} />
            <Stack.Screen name="BookedCab" component={BookedCabScreen} />
            <Stack.Screen name="RideDetails" component={RideDetails} />
            <Stack.Screen name="onlineChat" component={OnlineChat} />
            <Stack.Screen name="addMoney" component={AddMoneyScreen} />
            <Stack.Screen name="paymentMethod" component={SelectGatewayPage} />
            <Stack.Screen
              name="withdrawMoney"
              component={WithdrawMoneyScreen}
            />
          </Stack.Group>
        ) : (
          <Stack.Group screenOptions={{ headerShown: false }}>
         <Stack.Screen name="LoginRegister" component={LoginRegister}/>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegistrationPage} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
