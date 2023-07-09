import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomHeader from "../../../components/CustomHeader";
import CustomText from "../../../components/CustomText";
import { AntDesign, Entypo } from "@expo/vector-icons";
import commonStyles from "../../../../Utils/CommonStyles";
import { images } from "../../../../assets/images";
import { colors } from "../../../../Utils/Colors";
import { Spacer } from "../../../components/Spacer";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { ListItem } from "react-native-elements";
import AddlButton from "../../../components/AddlButton";
import moment from "moment/min/moment-with-locales";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const MyWallet = ({
  navigation,
  openDrawer,
  settings,
  auth,
  doReacharge,
  WalletHistory,
}) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    let wdata = WalletHistory;
    var wallHis = [];
    for (key in wdata) {
      wdata[key].walletKey = key;
      let tDate = new Date(wdata[key].date);
      wdata[key].date = moment(tDate).format("lll");
      wallHis.push(wdata[key]);
    }
    wallHis.length > 0 ? setData(wallHis.reverse()) : setData([]);
    console.log(data);
  }, [WalletHistory]);
  // const WalletHistory=  auth?.info && auth?.info?.profile? auth?.info?.profile?.walletHistory: [];
  // const data = [
  //     {
  //       id: 1,
  //       label: "Credited $23.00",
  //       name: "1234567890",
  //       icon: () => <AntDesign name="up" size={20} color={'green'} />,
  //     },
  //     {
  //       id: 2,
  //       label: "Debited $23.00",
  //       name: "523klsd",
  //       icon: () => <AntDesign name="down"  size={20}  color={'red'}/>,
  //     },
  //     {
  //       id: 3,
  //       label: "Credited $23.00",
  //       name: "Driver",
  //       icon: () => <AntDesign name="up"  size={20}  color={'green'}/>,
  //     },
  //     {
  //       id: 4,
  //       label: "Debited $23.00",
  //       name: "Car",
  //       icon: () => <AntDesign name="down"   size={20} color={'red'}/>,
  //     },
  //     {
  //       id: 5,
  //       label: "Credited $23.00",
  //       name: "4.5",
  //       icon: () => <AntDesign name="up"   size={20} color={'green'}/>,
  //     },
  //   ];

  const HistoryView = ({ amount, date, transaction_id, type }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 30,
        padding: 10,
        elevation: 5,
        backgroundColor: colors.white,
        borderRadius: 15,
        shadowColor: Platform.OS == "ios" ? "#ced4da" : colors.black,
        shadowRadius: 5,
        elevation: 5,
        // alignItems: "center",
        shadowOpacity: 0.3,

        shadowOffset: { width: 2, height: 2 },
      }}
    >
      <View
        style={{
          height: screenHeight / 17,
          width: screenHeight / 17,
          borderRadius: screenHeight / 17,
          backgroundColor: colors.white,
          elevation: 5,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {type === "Credit" ? (
          <AntDesign name="up" size={20} color={colors.lightGreen} />
        ) : (
          <AntDesign name="down" size={20} color={colors.red} />
        )}
      </View>
      <Spacer width={20} />
      <View style={{ flex: 8 }}>
        <View style={{ ...commonStyles.rowSpacerBetween }}>
          <CustomText label={type} fontSize={14} />
          <CustomText
            label={
              settings.symbol + parseFloat(amount).toFixed(settings.decimal)
            }
            fontSize={14}
            color={type === "Credit" ? colors.green : colors.red}
          />
        </View>
        <View style={{ ...commonStyles.rowSpacerBetween }}>
          <CustomText label={`Transaction Id`} fontSize={10} />
          <CustomText label={transaction_id} fontSize={10} />
        </View>
        <View style={{ ...commonStyles.rowSpacerBetween }}>
          <CustomText label={`Date / Time`} fontSize={10} />
          <CustomText label={date} fontSize={10} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <StatusBar hidden={false} />
      <Spacer height={Platform.OS == "android" ? 30 : 0} />
      <View
        style={{
          paddingVertical: 10,
          justifyContent: "center",
          width: "100%",
          paddingHorizontal: 15,
        }}
      >
        <Spacer height={Platform.OS=="android"? 20:0}/>
        <CustomHeader
          LeftSide={() => (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={openDrawer}
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
              <Entypo name="wallet" color={colors.primary} size={20} />
              <Spacer width={10} />
              <CustomText label="MyWallet" alignSelf={"center"} fontSize={15} />
            </View>
          )}
        />
      </View>
      <View
        style={{
          height: verticalScale(70),
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
          backgroundColor: colors.white,
          //   elevation: 5,
          backgroundColor: colors.gray1,
          alignItems: "center",
          flexDirection: "row",
          paddingHorizontal: 30,
          justifyContent: "space-between",
        }}
      >
        <CustomText label="Wallet Balance" fontSize={12} />
        {settings.swipe_symbol === false ? (
          <CustomText
            label={`${settings.symbol} ${
              auth.info && auth.info.profile
                ? parseFloat(auth.info.profile.walletBalance).toFixed(
                    settings.decimal
                  )
                : ""
            }`}
            fontSize={18}
            color={colors.primary}
            fontWeight={"bold"}
          />
        ) : (
          <CustomText
            label={`${
              auth.info && auth.info.profile
                ? parseFloat(auth.info.profile.walletBalance).toFixed(
                    settings.decimal
                  )
                : ""
            } ${settings.symbol}`}
            fontSize={18}
            color={colors.primary}
            fontWeight={"bold"}
          />
        )}
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Spacer height={20} />
        <CustomText label="Transaction History" fontSize={14} marginLeft={30} />
        <Spacer height={20} />
        {/* <View style={{ height: screenHeight / 1.6 }}> */}
        {/* <ScrollView showsVerticalScrollIndicator={false}> */}
        {data.map((item) => (
          <>
            <HistoryView
              amount={item.amount}
              type={item.type}
              transaction_id={item.transaction_id}
              date={item.date}
            />
            <Spacer height={20} />
          </>
        ))}
      </ScrollView>
      {/* </ScrollView> */}
      {/* </View> */}
      {/* <Spacer height={10} /> */}

      <View style={{ alignSelf: "center" }}>
        <AddlButton
          label="Add Money"
          width={"42%"}
          height={verticalScale(37)}
          // onPress={onAddShop}
          icon={images.add}
          textColor={colors.primary}
          onPress={doReacharge}
        />
      </View>
      <Spacer height={40} />

      {/* <TouchableOpacity
      activeOpacity={0.7}
        style={{
          ...commonStyles.rowContainer,
          backgroundColor: colors.white,
          elevation: 5,
          padding: 10,
          width: "50%",
          alignSelf: "center",
          borderRadius: 100,
        }}
      >
        <View style={{ width: scale(18), height: verticalScale(18) }}>
          <Image
            resizeMode="contain"
            source={images.add}
            style={{ ...commonStyles.img, tintColor: colors.primary }}
          />
        </View>
        <Spacer width={10} />

        <View>
          <CustomText
            label="Add Money"
            fontSize={14}
            color={colors.primary}
            fontWeight={"bold"}
          />
        </View>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
};

export default MyWallet;
