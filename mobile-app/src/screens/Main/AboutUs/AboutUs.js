import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { images } from "../../../../assets/images";
import commonStyles from "../../../../Utils/CommonStyles";
import { colors } from "../../../../Utils/Colors";
import CustomText from "../../../components/CustomText";
import CustomHeader from "../../../components/CustomHeader";
import { Icon } from "react-native-elements";


import { FontAwesome5 } from "@expo/vector-icons";

import { Spacer } from "../../../components/Spacer";
import { scale } from "react-native-size-matters";

const AboutUs = ({onPress}) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{ flex: 1, paddingHorizontal: scale(15), paddingVertical: 10 }}
      >
        <Spacer height={Platform.OS=="android"? 20:0}/>
        <CustomHeader
          LeftSide={() => (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={onPress}
              style={commonStyles.iconContainer}
            >
              <Image
                resizeMode="contain"
                source={images.sort}
                style={commonStyles.img}
              />
            </TouchableOpacity>
          )}
          Center={() => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: "-10%",
              }}
            >
              
                      {/* <FontAwesome5 color={colors.primary} size={20} name={"info"} /> */}
                      <Icon
                        name={"info"}
                        type={"entypo"}
                        color={colors.primary}
                        size={18}
                        // containerStyle={styles.iconStyle}
                      />

              {/* <MaterialIcons name="work" color={colors.primary} size={20} /> */}
              <Spacer width={10} />
              <CustomText
                label="My Booking"
                alignSelf={"center"}
                fontSize={16}
                fontFamily="Roboto-Bold"
                color={colors.lightText}
              />
            </View>
          )}
        />
        <View style={{ flex: 0.3, width: "70%", alignSelf: "center" }}>
          <Image
            resizeMode="contain"
            source={images.appLogo}
            style={{ ...commonStyles.img, tintColor: colors.black }}
          />
        </View>
        <View style={{ flex: 0.7, width: "100%",alignItems:"center",alignSelf:"center" }}>
          <CustomText
            label="We are the largest mobility platform and one of the world's largest online on-demand services provider. Manage bookings, request quotes, or book a online service with our simple and quick online booking system. We are an on-demand services company that allows guests to easily book verious services online.
            We offer the best services in the country."
            textAlign={"center"}
            fontSize={20}
            fontFamily={"Roboto-Regular"}
            color={colors.black}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AboutUs;

const styles = StyleSheet.create({});
