import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../../Utils/Colors";
import CustomText from "../../../../components/CustomText";
import { moderateScale, verticalScale } from "react-native-size-matters";

const BookPadalaBottom = () => {
  const [check, setCheck] = useState(false);

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginLeft: verticalScale(10),
        }}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => setCheck(!check)}
          style={styles.checkContainer}
        >
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
    </View>
  );
};

export default BookPadalaBottom;

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
});
