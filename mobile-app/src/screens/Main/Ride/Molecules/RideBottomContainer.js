import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { colors } from "../../../../../Utils/Colors";
import CustomText from "../../../../components/CustomText";
import CustomButton from "../../../../components/CustomButton";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { Spacer } from "../../../../components/Spacer";
import { Ionicons } from "@expo/vector-icons";

const RideBottomContainer = ({ onBook,navigation }) => {
  const [check, setCheck] = useState(false);
  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => setCheck(!check)}
          style={styles.checkContainer}>
          {check ? (
            <Ionicons
              name="checkmark-sharp"
              size={moderateScale(20)}
              color={colors.primary}
            />
          ) : (
            <></>
          )}
        </TouchableOpacity>
        <CustomText
          label={"Save this address"}
          color={colors.grayBorder}
          fontSize={12}
          fontFamily="Roboto-Regular"
          marginLeft={10}
        />
      </View>
      <Spacer height={25} />
      <View style={styles.btnContainer}>
        <CustomButton
          width={"46%"}
          height={verticalScale(40)}
          title="Check Rate"
          fontSize={12}
          onPress={onBook}
          backgroundColor={colors.white}
          borderColor={colors.primary}
          color={colors.primary}
          borderWidth={1}
          fontWeight={'bold'}
        />
        <CustomButton
          width={"46%"}
          height={verticalScale(40)}
          title="Book Now"
          onPress={()=>navigation.navigate("PaymentScreen")}
          color={"#1B1B1E"}
          fontSize={12}
          fontWeight={'bold'}
        />
      </View>
    </View>
  );
};

export default RideBottomContainer;

const styles = StyleSheet.create({
  checkContainer: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.grayBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
