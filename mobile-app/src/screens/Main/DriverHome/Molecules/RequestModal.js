import { StyleSheet, Text, View, Modal, Platform, Image } from "react-native";
import React, { useState } from "react";
import CustomButton from "../../../../components/CustomButton";
import { colors } from "../../../../../Utils/Colors";
import CustomText from "../../../../components/CustomText";
import { Spacer } from "../../../../components/Spacer";
import { scale, verticalScale } from "react-native-size-matters";
import { images } from "../../../../../assets/images";

const RequestModal = ({ isVisible, setIsVisible }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      activeOpacity={0}
      // backgroundColor={colors.white}
      onRequestClose={() => {
        setIsVisible(!isVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View
          style={{
            width: "90%",
            padding: 20,
            height: "35%",
            alignSelf: "center",
            backgroundColor: colors.white,
            // position: "absolute",
            borderRadius: 20,
            shadowOffset: { width: -2, height: -2 },
            shadowColor: Platform.OS == "ios" ? "#6c757d" : colors.black,
            shadowOpacity: 0.5,
            shadowRadius: 5,
          }}
        >
          <View style={{ width: "100%" }}>
            <CustomText
              label="21 Apr 2022 17:17"
              fontFamily={"Roboto-Bold"}
              fontSize={11}
              alignSelf="center"
              align="center"
              textAlign="center"
            />
          </View>
          <Spacer height={verticalScale(5)} />

          <CustomText
            label="$ 140.70"
            fontFamily={"Roboto-Bold"}
            // fontFamily={"regular"}
            fontSize={30}
            color={colors.lightBlack}
            alignSelf="center"
            align="center"
            textAlign="center"
          />
          <Spacer height={verticalScale(20)} />

          <View
            style={styles.rowContainer}
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
          <Spacer height={verticalScale(10)} />

          <View
            style={styles.rowContainer}
          >
            <View style={{ height: 30, width: 30 }}>
              <Image
                source={require("../../../../../assets/images/location.png")}
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
                    <Spacer height={verticalScale(20)} />

          <View style={styles.rowContainer}>
                <CustomButton
        onPress={() => setIsVisible(false)}
        width="40%"
        title="Ignore"
        height={verticalScale(30)}
        fontSize={12}
        borderRadius={10}
      />


          <CustomButton
        backgroundColor={colors.lightGray}
        color={colors.primary}
        onPress={() => setIsVisible(false)}
        borderRadius={10}
        borderWidth={1.5}
        borderColor={colors.grayBorder}
        width="40%"
        title="Accept"
        height={verticalScale(30)}
        fontSize={12}
      />

          </View>

        
        </View>
      </View>
    </Modal>
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

export default RequestModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,

    // marginTop: 22,
    // backgroundColor:"blue",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    backgroundColor: "red",
  },
  rowContainer:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  }
});
