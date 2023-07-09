import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import CustomHeader from "../../../components/CustomHeader";
import { colors } from "../../../../Utils/Colors";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import CustomText from "../../../components/CustomText";
import { Spacer } from "../../../components/Spacer";
import { moderateScale, verticalScale } from "react-native-size-matters";
import SepratorLine from "../../../components/SepratorLine";
import { images } from "../../../../assets/images";
import { FontAwesome5 } from "@expo/vector-icons";
import { Rating, AirbnbRating } from "react-native-ratings";
import CustomButton from "../../../components/CustomButton";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const Receipt = ({
  navigation,
  booking,
  moment,
  settings,
  onStarRatingPress,
  submitNow,
  starCount,
}) => {
  const CenterContent = () => (
    <View style={{ flexDirection: "row" }}>
      <FontAwesome5 name="receipt" size={24} color={colors.primary} />
      <Spacer width={10} />
      <CustomText label="Receipt" alignSelf={"center"} fontSize={17} />
    </View>
  );

  const [ratingCompleted, setRatingCompleted] = useState();

  return (
    <SafeAreaView>
      <View
        style={{
          //   backgroundColor: colors.primary,
          height: 80,
          justifyContent: "center",
          width: "auto",
          paddingHorizontal: 15,
        }}
      >
        <Spacer height={Platform.OS=="android"? 20:0}/>
        <CustomHeader
          LeftSide={() => (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons
                name="arrow-back"
                size={moderateScale(25)}
                color="black"
              />
            </TouchableOpacity>
          )}
          Center={() => <CenterContent />}
        />
      </View>
      <Spacer height={30} />
      <View style={{ width: "auto", paddingHorizontal: 25 }}>
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
          <Spacer width={10} />
          <View style={{ flex: 9 }}>
            <CustomText
              label={booking ? booking.pickup.add : ""}
              fontSize={10}
              color={colors.darkGray}
            />
          </View>
        </View>
        <Spacer height={10} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              height: 30,
              width: 30,
              justifyContent: "center",
            }}
          >
            <Image
              source={require("../../../../assets/images/location.png")}
              style={{ height: 20, width: 20 }}
              resizeMode={"contain"}
            />
          </View>
          <View style={{ flex: 9 }}>
            <CustomText
              label={booking ? booking.drop.add : ""}
              fontSize={10}
              color={colors.darkGray}
            />
          </View>
        </View>
      </View>

      <View>
        <Spacer height={40} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "auto",
            paddingHorizontal: 30,
          }}
        >
          <View>
            <CustomText
              label={
                booking && booking.tripdate
                  ? moment(booking.tripdate).format("lll")
                  : null
              }
              fontSize={12}
            />
          </View>
          <View>
            <CustomText
              label={
                booking
                  ? booking.customer_paid > 0
                    ? parseFloat(booking.customer_paid).toFixed(
                        settings.decimal
                      )
                    : 0
                  : null
              }
              fontSize={14}
              fontWeight={"Roboto-Bold"}
            />
          </View>
        </View>
      </View>
      <Spacer height={40} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "auto",
        }}
      >
        <SepratorLine height={0.7} width={"50%"} />
        <CustomText
          label="PLEASE RATE YOUR DRIVER"
          fontSize={13}
          fontFamily={"Roboto-Light"}
        />
        <SepratorLine height={0.7} width={"50%"} />
      </View>
      <Spacer height={60} />
      <View>
        <Image
          source={images.driverProfile}
          style={{ height: 80, width: 80, alignSelf: "center" }}
          resizeMode={"contain"}
        />
        <Spacer height={10} />
        <CustomText
          label="Testdriver Comfort"
          alignSelf={"center"}
          fontSize={14}
        />
      </View>
      <Spacer height={40} />
      <View>
        <AirbnbRating
          showRating={false}
          onFinishRating={(rating) => {
            onStarRatingPress(rating), console.log("NewRating", rating);
          }}
          // selectedColor={(rating) => {
          //   onStarRatingPress(rating), console.log("NewRating", rating);
          // }}
          size={45}
          starContainerStyle={{
            display: "flex",
            justifyContent: "space-evenly",
            width: "80%",
          }}
        />
      </View>
      <Spacer height={80} />
      <CustomButton
        title={"Submit Rating"}
        width={"80%"}
        alignSelf={"center"}
        fontFamily={"Roboto-Medium"}
        onPress={() => {
          submitNow(), console.log("Submitted Rating is", starCount);
        }}
        disabled={starCount > 0 ? false : true}
      />
    </SafeAreaView>
  );
};

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

export default Receipt;
