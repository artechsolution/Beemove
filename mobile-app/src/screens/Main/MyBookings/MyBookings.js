import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import { colors } from "../../../../Utils/Colors";
import CustomText from "../../../components/CustomText";
import { Spacer } from "../../../components/Spacer";
import {
  AntDesign,
  Feather,
  Octicons,
  MaterialIcons,
} from "@expo/vector-icons";
import CustomHeader from "../../../components/CustomHeader";
import { moderateScale } from "react-native-size-matters";
import commonStyles from "../../../../Utils/CommonStyles";
import { images } from "../../../../assets/images";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const MyBookings = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          paddingVertical: 10,
          justifyContent: "center",
          width: screenWidth,
          paddingHorizontal: 15,
        }}
      >
        <CustomHeader
          LeftSide={() => (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.openDrawer()}
              style={commonStyles.iconContainer}
            >
              <Image
                resizeMode="contain"
                source={images.sort}
                style={commonStyles.img}
              />
            </TouchableOpacity>
          )}
          Center={() => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: "-10%",
              }}
            >
              <MaterialIcons name="work" color={colors.primary} size={20} />
              <Spacer width={10} />
              <CustomText
                label="My Booking"
                alignSelf={"center"}
                fontSize={16}
                fontFamily="Roboto-Medium"
                // fontWeight={"bold"}
                color={colors.lightText}
              />
            </View>
          )}
        />
      </View>
      <Card />
    </SafeAreaView>
  );
};

export default MyBookings;

const Card = () => (
  <View
    style={{
      marginHorizontal: 30,
      backgroundColor: colors.white,
      marginTop: 40,
      elevation: 5,
      padding: 10,
      borderRadius: 10,
      shadowColor: Platform.OS == "ios" ? "#ced4da" : colors.black,
      shadowRadius: 5,
      elevation: 5,
      // alignItems: "center",
      shadowOpacity: 0.3,

      shadowOffset: { width: 2, height: 2 },
    }}
  >
    <View
      style={{
        height: 60,
        width: 60,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 99,
        backgroundColor: colors.white,
        borderWidth: 0.5,
        borderColor: colors.grayBorder,
        elevation: 5,
        position: "absolute",
        top: -20,
        left: -20,
      }}
    >
      <Image
        source={require("../../../../assets/images/car.png")}
        // style={{ height: 100, width: 100 }}
        resizeMode={"contain"}
      />
    </View>
    {/* Card Body */}
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: 40,
        }}
      >
        <View>
          <CustomText label={"27 Apr 2022 13:01"} fontSize={12} />
        </View>
        <View>
          <CustomText label={"$23.00"} fontSize={14} fontWeight={"bold"} />
        </View>
      </View>
      <Spacer height={20} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{}}>
          <BlurCircle />
        </View>
        <View>
          <CustomText
            label={"15 Pennsylvania Street Rocky Mount, NC 27804"}
            fontSize={10}
            color={colors.darkGray}
          />
        </View>
      </View>
      <Spacer height={10} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ height: 30, width: 30 }}>
          <Image
            source={require("../../../../assets/images/location.png")}
            style={{ height: 20, width: 20 }}
            resizeMode={"contain"}
          />
        </View>
        <View>
          <CustomText
            label={"15 Pennsylvania Street Rocky Mount, NC 27804"}
            fontSize={10}
            color={colors.darkGray}
          />
        </View>
      </View>
    </View>
  </View>
);

const BlurCircle = () => (
  <View
    style={{
      borderRadius: 30,
      borderWidth: 2,
      borderColor: colors.lightBlue,
      padding: 2,
    }}
  >
    <View
      style={{
        borderRadius: 30,
        backgroundColor: colors.lightBlue,
        width: 10,
        height: 10,
      }}
    ></View>
  </View>
);
const styles = StyleSheet.create({});
