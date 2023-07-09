import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import TopHeader from "../../../../components/TopHeader";
import PercentageSpacer from "../../../../components/PercentageSpacer";
import { Spacer } from "../../../../components/Spacer";
import CustomButton from "../../../../components/CustomButton";
import CustomText from "../../../../components/CustomText";
import { colors } from "../../../../../Utils/Colors";
import commonStyles from "../../../../../Utils/CommonStyles";
import OTPTextInput from "react-native-otp-textinput";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { scale, verticalScale } from "react-native-size-matters";

const OtpScreen = ({navigation,state,onVerify,setState,onResend}) => {
  const [otpCode, setOtpCode] = useState("");
  // state.verificationId?`Enter 6 digit code sent to your mobile number ${state.contact} `

  return (
    <>

      <Spacer height={20} />
      <TopHeader
        label1={"Enter Code"}
        img={require("../../../../../assets/images/appLogo.png")}
        label2={`Enter 6 digit code sent to your mobile number ${state.countryCode +" "+state.contact}`}
        spacerHeight={"5%"}
      />
      <PercentageSpacer height={"10%"} />
      {/* <View style={styles.otpContainer}> */}
      <View style={{ height: "10%" }}>
        <OTPInputView
          pinCount={6}
        
          codeInputHighlightStyle={styles.highLighted}
          autoFocusOnLoad
          codeInputFieldStyle={styles.underlineStyleBase}
          onCodeChanged={(value) => setState({ ...state, verificationCode: value })}

          onCodeFilled={(code) => {
            // value={state.verificationCode}
            // setIsVisible(true);

            // setTimeout(() => {
            //   setIsVisible(false);
            //   navigation.navigate("MainStack");
            // }, 2000);
            console.log(`Code is ${code}, you are good to go!`);
          }}
        />
      </View>

      <PercentageSpacer height={"20%"} />
      <CustomButton
        title="Verify Now"
        fontFamily={"Roboto-Regular"}
        onPress={onVerify}
      />
      <Spacer height={20} />

      {/* <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CustomText
          label="Didn't received code?"
          color={colors.lightBlack}
          fontFamily={"Roboto-Regular"}
          fontSize={11}
        />
        <CustomText
          label="Resend Code"
          onPress={onResend}
          color={colors.primary}
          marginLeft={2}
          fontFamily={"Roboto-Bold"}
          fontSize={11}
        />
      </View> */}
      </>

  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  otpContainer: {
    padding: 15,
  },
  highLighted: {
    // borderColor: colors.primary,
  },
  underlineStyleBase: {
    width: scale(40),
    height: verticalScale(50),
    borderWidth: -1,
    borderRightWidth: 1.5,
    borderLeftWidth: 1.5,
    borderTopWidth: 1.5,
    borderColor: colors.grayBorder,
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
    // borderRadius: scale(5),
    backgroundColor: colors.gray1,
    color: colors.black,
  },
});
