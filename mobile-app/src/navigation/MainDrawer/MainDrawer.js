import { View, Text, Image } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { colors } from "../../../Utils/Colors";
import CustomDrawer from "./CustomDrawer";
import DrawerContainer from "../../components/DrawerContainer";
import BookingStack from "../MainStack/BookingStack/BookingStack";
import { images } from "../../../assets/images";
import MyBookings from "../../screens/Main/MyBookings/MyBookings";
import MyEarnings from "../../screens/Main/MyEarnings/MyEarnings";
import { FontAwesome5 } from "@expo/vector-icons";
import MyWallet from "../../screens/Main/MyWallet/MyWallet";
import Profile from "../../screens/Main/Profile/Profile";
import CustomText from "../../components/CustomText";
import ConvertToDriver from "../../screens/Main/ConvertToDriver/ConvertToDriver";
import AboutUs from "../../screens/Main/AboutUs/AboutUs";
import DriverHome from "../../screens/Main/DriverHome/DriverHome";
import Home from "../../screens/Main/Home/Home";

const Drawer = createDrawerNavigator();
// FontAwesome5
const MainDrawer = () => {
  const CustomDrawerIcon = ({ icon }) => (
    <View style={{ flex: 0.2, alignItems: "center" }}>
      <FontAwesome5 size={16} name={icon} />
    </View>
  );
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
        drawerActiveTintColor: "#3f3f3f",
        drawerActiveBackgroundColor: colors.secondary,
        // drawerLabelStyle: {
        //   // marginLeft: -15,
        //   fontSize: 12,
        //   marginVertical: 5,
        //   backgroundColor:"red"
        // },
        drawerLabel: () => {
          let name = "";
          if (route.name === "bookingRequest") {
            name = "Booking Request";
          } else if (route.name === "myBookings") {
            name = "My Bookings";
          } else if (route.name === "myEarnings") {
            name = "My Earnings";
          } else if (route.name === "myWallet") {
            name = "My Wallet";
          } else if (route.name === "profileSetting") {
            name = "Profile Setting";
          } else if (route.name === "referAndEarn") {
            name = "Refer & Earn";
          } else if (route.name === "pushNotification") {
            name = "Push Notification";
          } else if (route.name === "aboutUs") {
            name = "About Us";
          } else if (route.name === "logout") {
            name = "Logout";
          } else if (route.name === "makeRequest") {
            name = "Make a Request";
          } else if (route.name === "convertToDriver") {
            name = "Convert To Driver";
          } else if (route.name === "Emergency") {
            name = "Emergency";
          }

          return <CustomText label={name} marginLeft={-15} />;
        },
      })}
      initialRouteName={"Home"}
    >
      <Drawer.Screen
        options={{
          // drawerItemStyle:{display:"none"},
          drawerIcon: ({ color }) => <CustomDrawerIcon icon={"home"} />,
        }}
        name="bookingRequest"
        component={DriverHome}
      />
      <Drawer.Screen
        options={{
          // drawerItemStyle:{display:"none"},
          drawerIcon: ({ color }) => <CustomDrawerIcon icon={"car-side"} />,
        }}
        name="myBookings"
        component={MyBookings}
      />
      <Drawer.Screen
        options={{
          // drawerItemStyle:{display:"none"},
          drawerIcon: ({ color }) => <CustomDrawerIcon icon={"bitcoin"} />,
        }}
        name="myEarnings"
        component={MyEarnings}
      />
      {/* <Drawer.Screen
        options={{
          // drawerItemStyle:{display:"none"},
          drawerIcon: ({ color }) => <CustomDrawerIcon icon={"user-alt"} />,
        }}
        name="convertToDriver"
        component={ConvertToDriver}
      /> */}
      {/* <Drawer.Screen
        options={{
          // drawerItemStyle:{display:"none"},
          drawerIcon: ({ color }) => <CustomDrawerIcon icon={"car"} />,
        }}
        name="makeRequest"
        component={BookingStack}
      /> */}
      {/* <Drawer.Screen
        options={{
          // drawerItemStyle:{display:"none"},
          drawerIcon: ({ color }) => <CustomDrawerIcon icon={"helicopter"} />,
        }}
        name="Emergency"
        component={BookingStack}
      /> */}
      <Drawer.Screen
        options={{
          // drawerItemStyle:{display:"none"},
          drawerIcon: ({ color }) => <CustomDrawerIcon icon={"wallet"} />,
        }}
        name="myWallet"
        component={MyWallet}
      />
      <Drawer.Screen
        options={{
          // drawerItemStyle:{display:"none"},
          drawerIcon: ({ color }) => <CustomDrawerIcon icon={"user-cog"} />,
        }}
        name="profileSetting"
        component={Profile}
      />
      {/* <Drawer.Screen
        options={{
          // drawerItemStyle:{display:"none"},
          drawerIcon: ({ color }) => <CustomDrawerIcon icon={"bitcoin"} />,
        }}
        name="referAndEarn"
        component={() => {}}
      /> */}
      <Drawer.Screen
        options={{
          // drawerItemStyle:{display:"none"},
          drawerIcon: ({ color }) => <CustomDrawerIcon icon={"bell"} />,
        }}
        name="pushNotification"
        component={() => {}}
      />
      <Drawer.Screen
        options={{
          // drawerItemStyle:{display:"none"},
          drawerIcon: ({ color }) => <CustomDrawerIcon icon={"info"} />,
        }}
        name="aboutUs"
        component={AboutUs}
      />
      <Drawer.Screen
        options={{
          // drawerItemStyle:{display:"none"},
          drawerIcon: ({ color }) => <CustomDrawerIcon icon={"door-closed"} />,
        }}
        name="logout"
        component={() => {}}
      />
    </Drawer.Navigator>
  );
};

export default MainDrawer;
