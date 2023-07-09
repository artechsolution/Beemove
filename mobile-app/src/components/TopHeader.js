import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import commonStyles from "../../Utils/CommonStyles";
import PercentageSpacer from "./PercentageSpacer";
import { Spacer } from "./Spacer";
import { MaterialIcons } from "@expo/vector-icons";
import { moderateScale, verticalScale } from "react-native-size-matters";
import CustomText from "./CustomText";
import { colors } from "../../Utils/Colors";

const TopHeader = ({
  navigation,
  label1,
  label2,
  img,
  imgHeight,
  backIcon,
  spacerHeight,
}) => {
  return (
    <>
      {backIcon ? (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons
            name="arrow-back"
            size={moderateScale(30)}
            color="black"
          />
        </TouchableOpacity>
      ) : (
        <></>
      )}
      {/* <PercentageSpacer height={"5%"} /> */}
      <Spacer height={30} />

      <Image
        resizeMode="contain"
        style={{
          width: 250,
          height: verticalScale(imgHeight || 100),
          alignSelf: "center",
        }}
        source={img}
      />
      <Spacer height={30} />
      {/* <PercentageSpacer height={spacerHeight || "15%"} /> */}
      <CustomText
        label={label1}
        color={colors.lightBlack}
        fontSize={20}
        //   fontWeight="Roboto-Medium"
      />
      {/* <View style={{ width: "80%" }}> */}
      <CustomText
        label={label2}
        color={colors.lightText}
        fontSize={12}
        fontFamily="Roboto-Light"
        marginTop={10}
      />
      {/* </View> */}
    </>
  );
};

export default TopHeader;

const styles = StyleSheet.create({});
