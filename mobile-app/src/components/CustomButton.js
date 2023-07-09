import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
// import { Ionicons } from "@expo/vector-icons";
import {
  ScaledSheet,
  verticalScale,
  scale,
  moderateScale,
} from 'react-native-size-matters';
import { colors } from '../../Utils/Colors';

// import { ActivityIndicator } from "react-native-paper";

function CustomButton({
  loading,
  title,
  onPress,
  color,
  width,
  height,
  borderRadius,
  marginTop,
  alignItems,
  justifyContent,
  backgroundColor,
  fontFamily,
  marginBottom,
  fontSize,
  marginHorizontal,
  alignSelf,
  borderWidth,
  borderColor,
  fontWeight
 
}) {
  return (
    <TouchableOpacity
    disabled={loading}
    activeOpacity={0.6}
    style={{
      backgroundColor: backgroundColor || colors.primary,
      width: width || '100%',
      height: height || verticalScale(50),
      borderRadius: borderRadius || 5,
      alignItems: alignItems || 'center',
      justifyContent: justifyContent || 'center',
      marginTop: marginTop,
      borderWidth:borderWidth,
      borderColor:borderColor,
      marginBottom: marginBottom,
      marginHorizontal: marginHorizontal,
      alignSelf: alignSelf,elevation:15
    
    }}
    onPress={onPress}>
    {loading ? (
      <ActivityIndicator color={colors.white} size={moderateScale(26)} />
    ) : (
      <View style={{flexDirection: 'row'}}>
        <Text
          style={[
            {
              color: color || colors.black,
              fontWeight:fontWeight||"300",
              fontSize: verticalScale(fontSize || 14),
              fontFamily: fontFamily || "Roboto-Light" ,
            },
          ]}>
          {title}
        </Text>
      </View>
    )}
  </TouchableOpacity>
   
  );
}

const styles = StyleSheet.create({
  filledButton: {
    backgroundColor: colors.primary,
  },
});

export default CustomButton;
