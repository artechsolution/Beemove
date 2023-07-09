import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import React from "react";
import { Spacer } from "../../../components/Spacer";
import commonStyles from "../../../../Utils/CommonStyles";
import PercentageSpacer from "../../../components/PercentageSpacer";
import TopRideContainer from "../../../components/TopRideContainer";
import RideBottomContainer from "../Ride/Molecules/RideBottomContainer";
import MainTopHeader from "../../../components/MainTopHeader";
import BookPadalaTop from "../Padala/BookPadala/BookPadalaTop";
import CustomTextInput from "../../../components/CustomTextInput";
import PabiliInnerContainer from "./PabiliInnerContainer";
import MapView, { Marker } from "react-native-maps";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../../../../Utils/Colors";

const PabiliScreen = ({navigation}) => {
  const region = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0,
    longitudeDelta: 0.0031,
  };

  const inputData = [
    {
      id: 1,
      withLabel: "Merchant Name",
      placeholder: "Name of Establishment",
    },
    {
      id: 2,
      withLabel: "Landmark",
      placeholder: "Nearby known Establishment Name",
    },
  ];
  return (
    <View style={{backgroundColor:colors.white}}>
      <Spacer height={Platform.OS == "ios" ? 40 : 5} />
      <ScrollView style={{}}>
        <View style={commonStyles.PH30}>
          <Spacer height={10} />
          <MainTopHeader
                  navigation={navigation}

            txt={"Pabili"}
            img={require("../../../../assets/images/card.png")}
          />
          <Spacer height={20} />
          <BookPadalaTop />
          <Spacer height={20} />
        </View>
        <MapView region={region} style={styles.map}>
          <Marker coordinate={{ latitude: 37.78825, longitude: -122.4324 }}>
            {/* <View style={{}}> */}
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 40,
                width: 45,
                backgroundColor: colors.primary,
                borderRadius: 15,
              }}
            >
              <AntDesign
                name="user"
                size={18}
                color={colors.white}
                style={{
                  alignSelf: "center",
                }}
              />
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <AntDesign
                name="caretdown"
                size={20}
                color={colors.primary}
                style={{ alignSelf: "center", marginTop: -7 }}
              />
              <View
                style={{
                  height: 12,
                  width: 12,
                  borderRadius: 6,
                  backgroundColor: colors.primary,
                  opacity: 0.5,
                  marginTop: -9,
                }}
              />
            </View>
            {/* </View> */}
          </Marker>
        </MapView>
        <View style={commonStyles.PH30}>
          <Spacer height={20} />

          {inputData.map((item) => {
            return (
              <>
                <CustomTextInput
                  withLabel={item.withLabel}
                  placeholder={item.placeholder}
                  fontSize={12}
                  paddingLeft={20}
                  placeholderTextColor={"#9C9C9C"}
                  fontFamily={"Roboto-Light"}
                />
                <Spacer height={20} />
              </>
            );
          })}
          <PabiliInnerContainer />
        </View>
        <Spacer height={100} />
      </ScrollView>
    </View>
  );
};

export default PabiliScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: Dimensions.get("window").height / 2,
  },
});
