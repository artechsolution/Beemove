import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import commonStyles from "../../../../../Utils/CommonStyles";
import MainTopHeader from "../../../../components/MainTopHeader";
import { Spacer } from "../../../../components/Spacer";
import PercentageSpacer from "../../../../components/PercentageSpacer";
import CustomTextInput from "../../../../components/CustomTextInput";
import { colors } from "../../../../../Utils/Colors";
import CustomText from "../../../../components/CustomText";
import BookPadalaBottom from "./BookPadalaBottom";
import { verticalScale } from "react-native-size-matters";
import BookPadalaTop from "./BookPadalaTop";
import MapView, { Marker } from "react-native-maps";
import { AntDesign } from "@expo/vector-icons";

const BookPadala = () => {
  const region = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0,
    longitudeDelta: 0.0031,
  };

  const inputData = [
    {
      id: 1,
      withLabel: "Pick-Up Address details",
      placeholder: "Unit number & Street number",
    },
    {
      id: 2,

      placeholder: "Contact Number",
      rightLabel: require("../../../../../assets/images/telephone.png"),
    },
    {
      id: 3,
      placeholder: "Contact Name",
      rightLabel: require("../../../../../assets/images/user.png"),
    },
  ];
  return (
    <View>
      <Spacer height={Platform.OS == "ios" ? 40 : 5} />

      <ScrollView style={{}}>
        <View style={commonStyles.PH30}>
          <Spacer height={10} />
          <MainTopHeader
            txt={"Padala"}
            img={require("../../../../../assets/images/time.png")}
          />
          <Spacer height={20} />
          <BookPadalaTop />

          <Spacer height={20} />
        </View>

        <MapView region={region} style={styles.map}>
          <Marker coordinate={{ latitude: 37.78825, longitude: -122.4324 }}>
            {/* <View style={{}}> */}
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 40,
                width: 45,
                backgroundColor: colors.primary,
                borderRadius: 15,
              }}
            >
              <AntDesign
                name="user"
                size={18}
                color={colors.white}
                style={{
                  alignSelf: "center",
                }}
              />
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <AntDesign
                name="caretdown"
                size={20}
                color={colors.primary}
                style={{ alignSelf: "center", marginTop: -7 }}
              />
              <View
                style={{
                  height: 12,
                  width: 12,
                  borderRadius: 6,
                  backgroundColor: colors.primary,
                  opacity: 0.5,
                  marginTop: -9,
                }}
              />
            </View>
            {/* </View> */}
          </Marker>
        </MapView>
        <View style={commonStyles.PH30}>
          <Spacer height={20} />

          {inputData.map((item) => {
            return (
              <>
                <CustomTextInput
                  withLabel={item.withLabel}
                  placeholder={item.placeholder}
                  fontSize={12}
                  paddingLeft={20}
                  rightLabel={item.rightLabel}
                  placeholderTextColor={"#9C9C9C"}
                  fontFamily={"Roboto-Light"}
                />
                <Spacer height={20} />
              </>
            );
          })}

          <Spacer height={10} />
          <BookPadalaBottom />
          <Spacer height={20} />

          <CustomTextInput
            withLabel={"Items Description"}
            placeholder={"Write description here..."}
            fontSize={12}
            alignItems="flex-start"
            multiline={true}
            height={verticalScale(100)}
            paddingLeft={20}
            // marginTop={verticalScale(10)}
            placeholderTextColor={"#9C9C9C"}
            fontFamily={"Roboto-Light"}
          />
        </View>
        <Spacer height={30} />
      </ScrollView>
    </View>
  );
};

export default BookPadala;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: Dimensions.get("window").height / 2,
  },
});
