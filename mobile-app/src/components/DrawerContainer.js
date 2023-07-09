import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from "react-native";
import React from "react";
import { colors } from "../../Utils/Colors";

const DrawerContainer = ({
  navigation,
  width,
  height,
  backgroundColor,
  margin,
  img,
  position,
}) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.openDrawer()}
      style={{
        width: width || 50,
        height: height || 50,
        borderRadius: 99,
        // borderColor:99,
        backgroundColor: backgroundColor || colors.white,
        position: position ||"absolute",
        // top: 0,
        marginTop: Platform.OS=="ios"? 20:40,
        marginHorizontal:20,

        // margin: margin || 30,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: Platform.OS == "ios" ? "#ced4da" : colors.black,
        shadowRadius: 5,
        elevation: 5,
        // alignItems: "center",
        shadowOpacity: 0.3,
  
        shadowOffset: { width: 2, height: 2 },
      }}
    >
      <Image style={{ width: 25, height: 25 }} source={img} />
    </TouchableOpacity>
  );
};

export default DrawerContainer;

const styles = StyleSheet.create({
  mainContainer: {
    width: 50,
    height: 50,
    borderRadius: 99,
    // borderColor:99,
    backgroundColor: colors.white,
    // position: "absolute",
    // top: 0,
    // margin: 20,
    // alignItems: "center",
    // justifyContent: "center",
  },
});
