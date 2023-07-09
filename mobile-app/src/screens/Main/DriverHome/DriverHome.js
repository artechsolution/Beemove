import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React,{useState} from "react";
import { scale } from "react-native-size-matters";
import CustomHeader from "../../../components/CustomHeader";
import commonStyles from "../../../../Utils/CommonStyles";
import { images } from "../../../../assets/images";
import {
  AntDesign,
  Feather,
  Octicons,
  MaterialIcons,
} from "@expo/vector-icons";
import CustomText from "../../../components/CustomText";
import { colors } from "../../../../Utils/Colors";
import { Spacer } from "../../../components/Spacer";
import ToggleSwitch from "toggle-switch-react-native";
import MapView, { Marker } from "react-native-maps";
import RequestModal from "./Molecules/RequestModal";

const DriverHome = ({ navigation }) => {
    const [isVisible,setIsVisible] = useState(true)
  const region = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0,
    longitudeDelta: 0.0031,
  };
  return (
      <>
       <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: scale(15), paddingVertical: 10 }}>
          <CustomHeader
            LeftSide={() => (
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => navigation.openDrawer()}
                style={commonStyles.iconContainer}
              >
                <Image
                  resizeMode="contain"
                  source={images.sort}
                  style={commonStyles.img}
                />
              </TouchableOpacity>
            )}
            RightSide={() => (
              <ToggleSwitch
                isOn={true}
                onColor={colors.primary}
                offColor={colors.darkGray}
                label="On Duty"
                labelStyle={{
                  color: "black",
                  fontWeight: "600",
                  color: colors.lightText,
                }}
                size="medium"
                onToggle={(isOn) => console.log("changed to : ", isOn)}
              />
            )}
            Center={() => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: "20%",
                }}
              >
                <MaterialIcons name="work" color={colors.primary} size={20} />

                {/* <MaterialIcons name="work" color={colors.primary} size={20} /> */}
                <Spacer width={10} />
                <CustomText
                  label="Request"
                  alignSelf={"center"}
                  fontSize={16}
                  fontFamily="Roboto-Medium"
                  // fontWeight={"bold"}
                  color={colors.lightText}
                />
              </View>
            )}
          />
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

      </View>
    </SafeAreaView>
              <RequestModal setIsVisible={setIsVisible} isVisible={isVisible}/>

      </>
   
  );
};

export default DriverHome;

const styles = StyleSheet.create({
  map: {
      flex:1
   
  },
});
