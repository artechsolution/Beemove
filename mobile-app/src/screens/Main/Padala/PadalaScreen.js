import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import React from "react";
import MainTopHeader from "../../../components/MainTopHeader";
import { Spacer } from "../../../components/Spacer";
import commonStyles from "../../../../Utils/CommonStyles";
import TopRideContainer from "../../../components/TopRideContainer";
import RideBottomContainer from "../Ride/Molecules/RideBottomContainer";
import PercentageSpacer from "../../../components/PercentageSpacer";
import AddlButton from "../../../components/AddlButton";
import { scale, verticalScale } from "react-native-size-matters";
import CustomButton from "../../../components/CustomButton";
import { colors } from "../../../../Utils/Colors";
import MapView, { Marker } from "react-native-maps";
import { AntDesign } from "@expo/vector-icons";

const PadalaScreen = ({ navigation }) => {
  const region = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0,
    longitudeDelta: 0.0031,
  };
  const RideBookData = [
    {
      id: 1,
      label: "Motorcycle",
      iconWidth: scale(35),
      iconHeight: verticalScale(35),

      icon: require("../../../../assets/images/bikecycle.png"),
    },
    {
      id: 2,
      label: "Sedan",
      icon: require("../../../../assets/images/Sedan.png"),
      iconWidth: scale(45),
      iconHeight: verticalScale(45),
    },
    {
      id: 3,
      label: "MPV",
      icon: require("../../../../assets/images/mpv.png"),
      iconWidth: scale(45),
      iconHeight: verticalScale(45),
    },
    {
      id: 4,
      label: "Van",
      icon: require("../../../../assets/images/van.png"),
      iconWidth: scale(45),
      iconHeight: verticalScale(45),
    },
    {
      id: 5,
      label: "FB Type Van",
      icon: require("../../../../assets/images/mpvtype.png"),
      iconWidth: scale(45),
      iconHeight: verticalScale(45),
    },
  ];
  return (
    <View style={{backgroundColor:colors.white}}>
      <Spacer height={Platform.OS == "ios" ? 40 : 5} />
      <ScrollView style={{}}>
        <View style={commonStyles.PH30}>
          <Spacer height={10} />
          <MainTopHeader
            txt={"Padala"}
            navigation={navigation}

            img={require("../../../../assets/images/time.png")}
          />
          <Spacer height={20} />

          <TopRideContainer
            onAddShop={() => navigation.navigate("BookPadala")}
          />
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

          {RideBookData.map((item) => {
            return (
              <>
                <AddlButton
                  label={item.label}
                  width={"98%"}
                  borderRadius={10}
                  iconWidth={item.iconWidth}
                  iconHeight={item.iconHeight}
                  txtSize={14}
                  fontFamily={"Roboto-Medium"}
                  textColor={"#8A8A8A"}
                  height={verticalScale(45)}
                  icon={item.icon}
                />
                <Spacer height={20} />
              </>
            );
          })}

          {/* <RideBottomContainer /> */}
          <Spacer height={20} />

          <View style={styles.btnContainer}>
            <CustomButton
              width={"46%"}
              height={verticalScale(40)}
              title="Check Rate"
              fontSize={12}
              // onPress={onBook}
              backgroundColor={colors.white}
              borderColor={colors.primary}
              color={colors.primary}
              borderWidth={1}
              fontWeight={"bold"}
            />
            <CustomButton
              width={"46%"}
              height={verticalScale(40)}
              title="Book Now"
              onPress={() => {
                navigation.navigate("BookPadala");
              }}
              color={"#1B1B1E"}
              fontSize={12}
              fontWeight={"bold"}
            />
          </View>
        </View>
        <Spacer height={100} />
      </ScrollView>
    </View>
  );
};

export default PadalaScreen;

const styles = StyleSheet.create({
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: Dimensions.get("window").height / 2,
  },
});
