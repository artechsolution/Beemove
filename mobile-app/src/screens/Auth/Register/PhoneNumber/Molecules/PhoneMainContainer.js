import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { scale, verticalScale } from "react-native-size-matters";
import { Spacer } from "../../../../../components/Spacer";
import CustomText from "../../../../../components/CustomText";
import { colors } from "../../../../../../Utils/Colors";
import PercentageSpacer from "../../../../../components/PercentageSpacer";
import CustomTextInput from "../../../../../components/CustomTextInput";
// import CountryPicker from 'react-native-country-picker-modal';
import PhoneInput from "react-native-phone-number-input";
import CustomButton from "../../../../../components/CustomButton";
import TopHeader from "../../../../../components/TopHeader";
import { images } from "../../../../../../assets/images";

const PhoneMainContainer = ({ state, setState }) => {
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  return (
    <>
      <View>
        <TopHeader
          label1={"Welcome!"}
          img={images.appLogo}
          label2={"Kindly enter your mobile number"}
        />
        <PercentageSpacer height={"13%"} />
        <PhoneInput
          initialCountry="in"
          initialValue={state.contact}
          onChangeText={(num) => {
            if (num.charAt(0) == 0) {
              console.log("numValue", num);
            } else {
              console.log("numValue", num);

              setState({ ...state, contact: num });
            }
          }}
          onChangeCountry={(country) => {
            let countryCodeValue = "+" + country.callingCode[0];
            console.log("CodeCountry", countryCodeValue);

            setState({ ...state, countryCode: countryCodeValue });
          }}
          containerStyle={{
            backgroundColor: colors.lightGray,
            borderColor: colors.darkGray,
            borderWidth: 1,
            borderRadius: scale(8),
            width: "100%",
          }}
          textContainerStyle={{
            backgroundColor: colors.lightGray,
            borderRadius: scale(8),
          }}
        />
        <PercentageSpacer height={"30%"} />
      </View>
    </>
  );
};

export default PhoneMainContainer;

const styles = StyleSheet.create({
  mainContainer: {},
});
