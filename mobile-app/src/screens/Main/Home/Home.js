import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import React from "react";
import BookRideContainer from "./Molecules/BookRideContainer";
import commonStyles from "../../../../Utils/CommonStyles";
import TopHeader from "../../../components/TopHeader";
import { Spacer } from "../../../components/Spacer";
import PercentageSpacer from "../../../components/PercentageSpacer";
import DrawerContainer from "../../../components/DrawerContainer";
import { colors } from "../../../../Utils/Colors";
import { images } from "../../../../assets/images";
import { useSelector } from "react-redux";

const Home = ({ navigation }) => {
  const auth = useSelector((state) => state?.auth);

  const BookingData = [
    {
      id: 1,
      img: images.bike,
      txt1: "Ride",
      txt2: "Maximum one passenger",
      imgWidth: 35,
      imgHeigth: 35,
      onPress: () => {
        navigation.navigate("SelectRide", { name: "Ride",img:images.bike });
      },
    },
    {
      id: 2,
      img: images.car,
      txt1: "Car",
      txt2: "Maximum four passengers",
      onPress: () => {
        navigation.navigate("SelectRide", { name: "Car",img:images.car });
      },
    },
    {
      id: 3,
      img:images.cart,
      txt1: "Padala",
      txt2: "Real time delivery within the city only",
      onPress: () => {
        navigation.navigate("SelectRide", { name: "Padala",img:images.cart });
      },
    },
    {
      id: 4,
      img: images.pabili,
      txt1: "Pabili",
      txt2: "For Foods, Grocery & Goods",
      onPress: () => {
        navigation.navigate("SelectRide", { name: "Pabili",img:images.pabili });
      },
    },
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <StatusBar hidden={false} />

      <View style={commonStyles.container1}>
        <Spacer height={Platform.OS == "ios" ? 50 : 10} />

        <DrawerContainer navigation={navigation} img={images.sort} />
        <Spacer height={Platform.OS == "android" ? 50 : 10} />


        <TopHeader
          img={require("../../../../assets/images/delivery.png")}
          label1={"Hi " + auth?.info?.profile?.firstName + " !"}
          imgHeight={80}
          label2={"How can we help you today?"}
          spacerHeight={"7%"}
          navigation={navigation}
        />
        <PercentageSpacer height={"10%"} />

        {BookingData.map((item) => {
          return (
            <>
              <BookRideContainer item={item} />
              <Spacer height={15} />
            </>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});
