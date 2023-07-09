import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import commonStyles from "../../../../../Utils/CommonStyles";
import { Spacer } from "../../../../components/Spacer";
import { moderateScale } from "react-native-size-matters";
import PhoneMainContainer from "./Molecules/PhoneMainContainer";
import PercentageSpacer from "../../../../components/PercentageSpacer";

const PhoneNumber = ({ navigation }) => {
  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.PH30}>
        <Spacer height={10} />
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons
            name="arrow-back"
            size={moderateScale(30)}
            color="black"
          />
        </TouchableOpacity>
        <PercentageSpacer height={"5%"} />
        <PhoneMainContainer navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default PhoneNumber;

const styles = StyleSheet.create({});
