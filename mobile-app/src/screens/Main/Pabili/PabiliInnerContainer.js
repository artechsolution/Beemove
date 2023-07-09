import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import CustomText from "../../../components/CustomText";
import { colors } from "../../../../Utils/Colors";
import AddlButton from "../../../components/AddlButton";
import { verticalScale } from "react-native-size-matters";
import CustomTextInput from "../../../components/CustomTextInput";
import { Spacer } from "../../../components/Spacer";

const PabiliInnerContainer = () => {
  const [check, setCheck] = useState(-1);
  const addBtn = [
    { id: 1, label: "Cash" },
    { id: 2, label: "GCash" },
  ];

  return (
    <View>
      <CustomText
        label={"Payment Method"}
        color={colors.labelColor}
        fontSize={12}
        fontFamily="Roboto-Regular"
        marginLeft={10}
        marginBottom={10}
      />

      <View style={styles.paymentContainer}>
        {addBtn.map((item, index) => {
          return (
            <AddlButton
              item={item}
              check={check}
              setCheck={setCheck}
              label={item.label}
              width={"48%"}
              height={verticalScale(45)}
              borderRadius={10}
              checkbtn
              // onPress={onAddShop}
              // icon={require("../../assets/images/add.png")}
              textColor={colors.black}
            />
          );
        })}
      </View>
      <Spacer height={20} />

      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <CustomTextInput
          withLabel={"Item to Purchased"}
          placeholder={"Products/Items Description"}
          fontSize={10}
          // width={"80%"}
          mainWidth={"75%"}
          paddingLeft={10}
          placeholderTextColor={"#9C9C9C"}
          fontFamily={"Roboto-Light"}
        />
        <CustomTextInput
          //  marginTop={30}
          placeholder={"QTY"}
          mainTop={30}
          fontSize={10}
          mainWidth={"20%"}
          // width={"30%"}
          // paddingLeft={20}
          placeholderTextColor={"#9C9C9C"}
          fontFamily={"Roboto-Light"}
        />
      </View>
      <Spacer height={20} />

      <View style={{ alignSelf: "center" }}>
        <AddlButton
          label="Add More Items"
          width={"50%"}
          height={verticalScale(37)}
          // onPress={onAddShop}
          icon={require("../../../../assets/images/add.png")}
          textColor={colors.primary}
          txtSize={12}
          iconHeight={12}
        />
      </View>
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
  );
};

export default PabiliInnerContainer;

const styles = StyleSheet.create({
  paymentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
