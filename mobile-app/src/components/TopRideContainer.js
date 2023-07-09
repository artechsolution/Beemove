import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import CustomText from "./CustomText";
import CustomTextInput from "./CustomTextInput";
import { Spacer } from "./Spacer";
import { scale, verticalScale } from "react-native-size-matters";
import { colors } from "../../Utils/Colors";
import AddlButton from "./AddlButton";
import CustomButton from "./CustomButton";
import i18n from "i18n-js";
import Animated from "react-native-reanimated";

const { t } = i18n;
const isRTL =
  i18n.locale.indexOf("he") === 0 || i18n.locale.indexOf("ar") === 0;

const TopRideContainer = ({
  onAddShop,
  completeJob = false,
  tripdata,
  tapAddress,
  displayAnimationStyle
  // showDropOff,
  // showPickup,
}) => {
  const dot = ["1", "2"];
  const fiveDot = ["1", "2", "3", "4", "5"];
  return (
    <Animated.View style={[displayAnimationStyle]}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ alignItems: "center", marginRight: scale(20),flex:1 }}>
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
          <Spacer height={5} />
          {/* <CustomText label="...." /> */}
          {completeJob
            ? dot.map((item) => {
                return (
                  <CustomText
                    label="."
                    fontSize={20}
                    marginTop={-15}
                    color={"#D4D4D4"}
                  />
                );
              })
            : fiveDot.map((item) => {
                return (
                  <CustomText
                    label="."
                    fontSize={20}
                    marginTop={-15}
                    color={"#D4D4D4"}
                  />
                );
              })}

          <Image
            source={require("../../assets/images/location.png")}
            style={{ width: 20, height: 20 }}
          />
        </View>

        <View style={{ marginRight: scale(20), justifyContent: "center",flex:9, }}>
          {completeJob ? (
            <>
              <View style={{ padding: 5 }}>
                <CustomText
                  label={"12 Cambridge Court Ponte Vedra Beach, FL 32082"}
                  fontSize={11}
                  numberOfLines={1}
                />
              </View>
              <Spacer height={20} />
              <View style={{ padding: 5 }}>
                <CustomText
                  label={"15 Pennsylvania Street Rocky Mount, NC 27804"}
                  fontSize={11}
                  numberOfLines={1}
                />
              </View>
            </>
          ) : (
            <>
              <TouchableOpacity
              onPressIn={()=>tapAddress('pickup')}
              activeOpacity={0.6}
                style={{
                  borderWidth: 1,
                  borderRadius: 8,
                  borderColor: "#ccc",
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                }}
              >
                <Text style={{}} numberOfLines={1}>
                  {tripdata.pickup && tripdata.pickup.add
                    ? tripdata.pickup.add
                    : t("map_screen_where_input_text")}
                </Text>
              </TouchableOpacity>
              <Spacer height={20} />
              <TouchableOpacity
              onPressIn={()=>tapAddress('drop')}
              activeOpacity={0.6}
                style={{
                  borderWidth: 1,
                  borderRadius: 8,
                  borderColor: "#ccc",
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                }}
              >
                <Text style={{}} numberOfLines={1}>
                  {tripdata.drop && tripdata.drop.add
                    ? tripdata.drop.add
                    // ? tripdata.drop.add.split(",")[0] + "," + tripdata.drop.add.split(",")[1] + "," + tripdata.drop.add.split(",")[2]
                    : t("map_screen_drop_input_text")}
                </Text>
              </TouchableOpacity>
              {/* <CustomTextInput
              value={tripdata.pickup && tripdata.pickup.add ? tripdata.pickup.add : t('map_screen_where_input_text')}
              onPressIn={()=>tapAddress('pickup')}
              
              height={verticalScale(40)}
                width={"95%"}
                placeholder="Pick-up location"
                borderColor={colors.grayBorder}
                borderWidth={1}
                backgroundColor={colors.white}
                borderRadius={10}
                paddingLeft={20}
                fontSize={11}
              /> */}
              {/* <CustomTextInput
              value={tripdata.drop && tripdata.drop.add ? tripdata.drop.add : t('map_screen_drop_input_text')}
              onPressIn={()=>tapAddress('drop')}
              
              
                height={verticalScale(40)}
                width={"95%"}
                placeholder="Drop-off location"
                borderColor={colors.grayBorder}
                borderWidth={1}
                backgroundColor={colors.white}
                borderRadius={10}
                paddingLeft={20}
                fontSize={11}
              /> */}
            </>
          )}
        </View>
      </View>

      {/* <Spacer height={20} /> */}

      <View style={{ alignSelf: "center" }}>
        {completeJob ? (
          <CustomButton
            title={"CompleteJob"}
            width={140}
            height={40}
            borderRadius={100}
            fontWeight={"bold"}
            fontSize={12}
            color={colors.primary}
            backgroundColor={colors.white}
          />
        ) : (
          <>
            {/* <AddlButton
             label="Add Stop"
             width={"42%"}
             height={verticalScale(37)}
             onPress={onAddShop}
             icon={require("../../assets/images/add.png")}
             textColor={colors.primary}
           /> */}
          </>
        )}
      </View>
    </Animated.View>
  );
};

export default TopRideContainer;

const styles = StyleSheet.create({});
