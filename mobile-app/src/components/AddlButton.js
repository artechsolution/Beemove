import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import React from "react";
import CustomText from "./CustomText";
import { colors } from "../../Utils/Colors";
// import {Spacer} from '../../../../components/Spacer';
import { Spacer } from "./Spacer";
import { moderateScale } from "react-native-size-matters";

const AddlButton = ({
  label,
  icon,
  borderRadius,
  borderWidth,
  backgroundColor,
  textColor,
  height,
  fontFamily,
  width,
  iconWidth,
  iconHeight,
  txtSize,
  onPress,
  checkbtn,
  item,
  check,
  setCheck,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.6}
    style={{
      backgroundColor: backgroundColor || colors.white,
      width: width || "100%",
      flexDirection: "row",
      borderWidth: borderWidth || 1,
      borderColor: colors.gray1,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: borderRadius || moderateScale(50),
      // alignSelf: "center",
      padding: moderateScale(10),
      height: height,
      shadowColor: Platform.OS == "ios" ? "#ced4da" : colors.black,
      shadowRadius: 5,
      elevation: 5,
      // alignItems: "center",
      shadowOpacity: 0.3,

      shadowOffset: { width: 2, height: 2 },
    }}
  >
    <View style={{ flex: 4, flexDirection: "row",justifyContent:"center" }}>
      {/* <Spacer width={12} /> */}
      {icon ? (
        <Image
          source={icon}
          style={{
            width: iconWidth || 15,
            height: iconHeight || 15,
            tintColor: colors.primary,
            
          }}
          resizeMode={"contain"}
        />
      ) : (
        <></>
      )}
      {checkbtn ? (
        <TouchableOpacity
        activeOpacity={0.6}
        onPress={()=>setCheck(item.id)}
          style={{
            borderRadius: 30,
            borderWidth: 2,
            borderColor: colors.primary,
            // padding: 2,
            width:18,
            height:18,
            alignItems:"center",
            justifyContent:"center"

          }}
        >
          {
           item.id== check?(
              <View
              style={{
                borderRadius: 30,
                backgroundColor: colors.primary,
                width: 10,
                height: 10,
              }}
            ></View>
            ):<></>


        }
        
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </View>
    <View style={{ flex: 6, }}>
      <CustomText
        fontFamily={fontFamily || "Roboto-Regular"}
        color={textColor || colors.black}
        fontSize={txtSize || 12}
        label={label}
      />
    </View>
  </TouchableOpacity>
);

export default AddlButton;
