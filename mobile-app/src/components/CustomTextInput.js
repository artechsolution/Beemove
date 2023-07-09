import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import React from "react";
import {
  moderateScale,
  scale,
  ScaledSheet,
  verticalScale,
} from "react-native-size-matters";
import CustomText from "./CustomText";
import { colors } from "../../Utils/Colors";
import commonStyles from "../../Utils/CommonStyles";

const CustomTextInput = ({
  eyeClick,
  password,
  setEyeClick,
  error,
  leftLabel,
  children,
  withLabel,
  rightLabel,
  rightLabelIcon,
  editable,
  onPressIn,
  defaultValue,
  ...props
}) => {
  return (
    <View style={{ width: props.mainWidth, marginTop: props.mainTop }}>
      {withLabel ? (
        <CustomText
          label={withLabel}
          fontSize={verticalScale(9)}
          color={colors.labelColor}
          fontFamily={"Roboto-Regular"}
          // fontWeight={"700"}
          marginBottom={verticalScale(7)}
          marginLeft={20}
        />
      ) : (
        <></>
      )}

      <TouchableOpacity
        onPress={props.onPress}
        disabled={!props.onPress}
        style={[
          {
            width: props.width || "100%",
            height: props.height || verticalScale(45),
            borderRadius: props.borderRadius || moderateScale(7),
            backgroundColor: props.backgroundColor || "#F9F9F9",
            marginTop: props.marginTop || verticalScale(0),
            flexDirection: "row",
            borderWidth: props.borderWidth || 0.5,
            borderColor: props.borderColor || "#707070",
            alignItems: props.alignItems || "center",
            paddingLeft: props.paddingLeft,
          },
        ]}
      >
        <TextInput
          style={[
            {
              width: rightLabel ? "82%" : "95%",
              height: props.inputHeight || "100%",
              marginLeft: props.inputLeftMargin || 10,
              marginTop: props.marginTop,
              paddingRight: props.paddingRight || 10,
              paddingHorizontal: props.paddingHorizontal,
              fontFamily: props.fontFamily || "Roboto-Regular",
              color: props.color || colors.black,
              fontSize: verticalScale(props.fontSize || 13),
              // textAlign: props.textAlign || "center",
              // alignSelf: props.alignItems || "center"
            },
          ]}
          defaultValue={defaultValue}
          editable={editable}
          onPressIn={onPressIn}
          onChangeText={props.onChangeText}
          value={props.value}
          numberOfLines={props.numberOfLines}
          keyboardType={props.keyboardType}
          autoCapitalize="none"
          multiline={props.multiline}
          placeholder={props.placeholder}
          placeholderTextColor={props.placeholderTextColor}
          secureTextEntry={props.secureTextEntry}
          
        />

        {rightLabel ? (
          <View style={{ width: 20, height: 20 }}>
            <Image
              source={rightLabel}
              resizeMode={"contain"}
              style={{ ...commonStyles.img, tintColor: "#C8C8C8" }}
            />
          </View>
        ) : null}
      </TouchableOpacity>
      {error ? (
        <CustomText
          label="* "
          children={error}
          fontSize={verticalScale(8)}
          color={colors.red}
          fontWeight={"600"}
          marginTop={verticalScale(5)}
        />
      ) : null}
    </View>
  );
};
export default CustomTextInput;
const styles = ScaledSheet.create({
  icon: {
    width: "20@s",
    height: "15@vs",
    tintColor: colors.gray,
  },
});
