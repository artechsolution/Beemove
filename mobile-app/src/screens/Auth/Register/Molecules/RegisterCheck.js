import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { colors } from "../../../../../Utils/Colors";
import { Spacer } from "../../../../components/Spacer";
import CustomText from "../../../../components/CustomText";

const RegisterCheck = ({ item, check, setCheck }) => {
  return (
    <View style={styles.Container}>
      <View style={styles.Container}>
        <Spacer width={10} />

        <TouchableOpacity
          onPress={() => setCheck(item)}
          style={styles.checkContainer}
        >
          {item == check ? <View style={styles.check}></View> : <></>}
        </TouchableOpacity>

        <CustomText
          label={item}
          color={colors.lightBlack}
          fontFamily={"Roboto-Regular"}
          fontSize={11}
          marginLeft={5}
        />
      </View>
    </View>
  );
};

export default RegisterCheck;

const styles = StyleSheet.create({
  Container: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkContainer: {
    width: 20,
    height: 20,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  check: {
    width: 18,
    height: 18,
    borderRadius: 18,
    backgroundColor: colors.primary,
  },
});
