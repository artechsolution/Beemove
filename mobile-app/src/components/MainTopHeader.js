import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import commonStyles from "../../Utils/CommonStyles";
import CustomText from "./CustomText";
import { colors } from "../../Utils/Colors";

const MainTopHeader = ({ txt, img,navigation,openDrawer,rightImg }) => {
  return (
    <View style={styles.mainCotainer}>
      <TouchableOpacity
      activeOpacity={0.6}
      onPress={openDrawer}
       style={commonStyles.iconContainer}>
        <Image
          resizeMode="contain"
          source={require("../../assets/images/sort.png")}
          style={commonStyles.img}
        />
      </TouchableOpacity>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {img ? (
          <View style={commonStyles.iconContainer}>
            <Image resizeMode="contain" source={img} style={commonStyles.img} />
          </View>
        ) : (
          <></>
        )}

        <CustomText
          label={txt}
          color={colors.lightText}
          fontSize={15}
          fontFamily="Roboto-Bold"
          marginLeft={10}
        />
      </View>
      <View>
        <View style={{ width: 25, height: 25 }}>
          <Image
            resizeMode="contain"
            source={rightImg}
            style={commonStyles.img}
          />
        </View>
      </View>
    </View>
  );
};

export default MainTopHeader;

const styles = StyleSheet.create({
  mainCotainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
