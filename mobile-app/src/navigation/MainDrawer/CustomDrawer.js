import {
    View,
    Text,
    ImageBackground,
    Image,
    TouchableOpacity,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import {
    DrawerContentScrollView,
    DrawerItemList,
  } from "@react-navigation/drawer";
 
  import { useNavigation } from "@react-navigation/native";
import SepratorLine from "../../components/SepratorLine";
import { verticalScale } from "react-native-size-matters";
import { Spacer } from "../../components/Spacer";
import { colors } from "../../../Utils/Colors";
import CircleImageContainer from "../../components/CircleImageContainer";
  
  const CustomDrawer = ({ ...props }) => {
    const navigation = useNavigation();
  
    return (
      <View style={{ flex: 1 }}>
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={{ backgroundColor: colors.white }}
        >
          <View style={{ height: verticalScale(140), justifyContent: "center",}}>
            <TouchableOpacity 
            activeOpacity={0.6}
            onPress={() => navigation.navigate("ProfileStack")}
  
            style={{ alignItems: "center" }}>
                <CircleImageContainer/>
                <Spacer height={7}/>
            
  
              <View >
                <Text
                  style={{
                    fontSize: verticalScale(18),
                    color: colors.black,
                    fontFamily: "Roboto-Bold",
                    alignSelf:"center"
                  }}
                >
                  {"awais abbas"}
                </Text>
                <View
                >
                  <Text
                    style={{
                      color: colors.primary,
                      justifyContent: "center",
                      fontFamily: "Roboto-Medium",
  
                      fontSize: verticalScale(12),
                    }}
                  >
                    {"awaisabbas6562@gmail.com"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <Spacer height={10} />
            <SepratorLine height={1}  width={"100%"} />
          </View>
          <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 10 }}>
            <DrawerItemList {...props} />
          </View>
        </DrawerContentScrollView>
  
       
      </View>
    );
  };
  
  export default CustomDrawer;
  