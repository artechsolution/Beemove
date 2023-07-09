import {
  View,
  Text,
  Image,
  Dimensions,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomHeader from "../../../components/CustomHeader";
import CustomText from "../../../components/CustomText";
import { colors } from "../../../../Utils/Colors";
import { images } from "../../../../assets/images";
import { Spacer } from "../../../components/Spacer";
import commonStyles from "../../../../Utils/CommonStyles";
import { scale, verticalScale } from "react-native-size-matters";
import { AntDesign, Feather, Octicons } from "@expo/vector-icons";
import CustomButton from "../../../components/CustomButton";
import PercentageSpacer from "../../../components/PercentageSpacer";
import { useIsFocused } from "@react-navigation/native";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const Profile = ({
  navigation,
  profileData,
  editProfile,
  onChangeFunction,
  showActionSheet,
  loader,
  logOff,
  deleteAccount,
  openDrawer,
}) => {
  const isFocused = useIsFocused();
  const [data, setData] = useState( [  
    {
      id: 1,
      label: "Phone",
      name: profileData?.mobile,
      icon: () => <Feather name="phone" size={20} color={colors.primary} />,
    },
    {
      id: 2,
      label: "Referral Id",
      name: profileData?.referralId,
      icon: () => (
        <Octicons name="cross-reference" size={20} color={colors.primary} />
      ),
    },
    {
      id: 3,
      label: "User Type",
      name: profileData?.usertype == "rider" ? "Customer" : "Driver",
      icon: () => <Feather name="user" size={20} color={colors.primary} />,
    },
 
  ]) 
  const riderData = [
    {
      id: 1,
      label: "Phone",
      name: profileData?.mobile,
      icon: () => <Feather name="phone" size={20} color={colors.primary} />,
    },
    {
      id: 2,
      label: "Referral Id",
      name: profileData?.referralId,
      icon: () => (
        <Octicons name="cross-reference" size={20} color={colors.primary} />
      ),
    },
    {
      id: 3,
      label: "User Type",
      name: profileData?.usertype == "rider" ? "Customer" : "Driver",
      icon: () => <Feather name="user" size={20} color={colors.primary} />,
    },
 
  ];
  const driverData = [
    {
      id: 1,
      label: "Phone",
      name: profileData?.mobile,
      icon: () => <Feather name="phone" size={20} color={colors.primary} />,
    },
    {
      id: 2,
      label: "Referral Id",
      name: profileData?.referralId,
      icon: () => (
        <Octicons name="cross-reference" size={20} color={colors.primary} />
      ),
    },
    {
      id: 3,
      label: "User Type",
      name: profileData?.usertype == "rider" ? "Customer" : "Driver",
      icon: () => <Feather name="user" size={20} color={colors.primary} />,
    },
    {
      id: 4,
      label: "Vehicle Type",
      name: profileData?.carType,
      icon: () => <AntDesign name="car" size={20} color={colors.primary} />,
    },
    {
      id: 5,
      label: "Driver Rating", 
      name:
        profileData && profileData.usertype && profileData.ratings
          ? parseFloat(profileData.ratings.userrating)
          : 0,
      icon: () => (
        <AntDesign name="like2" size={20} color={colors.primary} />
      ),
    },
  ];
  // useEffect(() => {
  //   if (profileData?.usertype === "rider" ) {
  //     setData(riderData)
  //   }else{
  //     setData(driverData)
  //   }
  //   console.log(data)
  // }, [isFocused]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white, }}>
      
        <View style={{ height: screenHeight / 3 }}>
          <Image
          // resizeMode="contain"
            source={images.profileBg}
            style={{ height: screenHeight / 3.5, width: screenWidth }}
          />
          {/* profile detail container*/}
          <View style={{ position: "absolute" }}>
          <Spacer height={Platform.OS=="ios"? 40:20}/>
            <View
              style={{
                padding: 15,
                justifyContent: "center",
                width: screenWidth,
              }}
            >
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
                      style={{ ...commonStyles.img, tintColor: colors.black }}
                    />
                  </TouchableOpacity>
                )}
                Center={() => (
                  <CustomText
                    label="Profile"
                    alignSelf={"center"}
                    fontSize={16}
                    fontWeight={"bold"}
                    color={colors.lightText}
                  />
                )}
                RightSide={() => (
                  <View style={{flexDirection:"row",alignItems:"center"}}>
  
           <TouchableOpacity activeOpacity={0.7} onPress={editProfile}>
                    <Feather name="edit" size={18} color={colors.lightText} />
                  </TouchableOpacity>
                  <Spacer width={10}/>

                  {profileData && profileData.usertype == "driver" ? (
          <View style={{flexDirection:"row",alignItems:"center"}}>
  <CustomText
                    label="On Duty"
                    alignSelf={"center"}
                    fontSize={13}
                    fontWeight={"bold"}
                    color={colors.lightText}
                  />
                              <Switch
              style={{ marginLeft: 5 }}
              value={profileData ? profileData.driverActiveStatus : false}
              onValueChange={onChangeFunction}

              trackColor={{ false: "#767577", true: colors.primary }}
              thumbColor={
                profileData? "#f4f3f4" : "#f4f3f4"
              }
            />
          </View>
        ) : null}
          

                  </View>
               
                )}
              />
            </View>
            <Spacer height={20} />
            <View
              style={{
                flexDirection: "row",
                paddingLeft: verticalScale(20),
                paddingRight: verticalScale(30),
                justifyContent: "space-between",
              }}
            >
              <View style={{}}>
                <CustomText
                  label={
                    profileData?.firstName.toUpperCase() +
                    " " +
                    profileData?.lastName.toUpperCase()
                  }
                  fontSize={16}
                  color={colors.lightText}
                />
                <CustomText
                  label={profileData?.email || "danialrozer@email.com"}
                  fontSize={10}
                  color={colors.lightText}
                />
              </View>
              <TouchableOpacity
                onPress={showActionSheet}
                style={{
                  height: screenHeight / 7,
                  width: screenHeight / 7,
                  backgroundColor: colors.primary,
                  borderRadius: screenHeight / 7,
                  borderWidth: 3,
                  borderColor: "#eee",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* <Image
                  source={
                    profileData && profileData.profile_image
                      ? { uri: profileData.profile_image }
                      : images.profilePic
                  }
                  resizeMode={"contain"}
                  style={{ height: screenHeight / 7.3 }}
                /> */}
                {loader ? (
                  <View>
                    <ActivityIndicator
                      size="large"
                      color={colors.INDICATOR_BLUE}
                    />
                  </View>
                ) : (
                  <Image
                    source={
                      profileData && profileData.profile_image
                        ? { uri: profileData.profile_image }
                        : images.profilePic
                    }
                    style={{
                      height: screenHeight / 7.3,
                      width: screenHeight / 7.3,
                      borderRadius: screenHeight / 7,
                    }}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Spacer height={50} />
      <ScrollView>
        {/* <PercentageSpacer height={"15%"}/> */}
        {/* <Spacer height={40} /> */}
        {/* {profileData && profileData.usertype == "driver" ? (
          <View>
            <Text>active_status</Text>
            <Switch
              style={{ marginHorizontal: 15 }}
              value={profileData ? profileData.driverActiveStatus : false}
              onValueChange={onChangeFunction}
            />
          </View>
        ) : null} */}
        <View style={{ paddingHorizontal: scale(25), }}>
          {profileData?.usertype === "rider"?riderData.map((item) => (
            <>
              <InfoView label={item.label} name={item.name} icon={item.icon} />
              <Spacer height={20} />
            </>
          )):driverData.map((item) => (
            <>
              <InfoView label={item.label} name={item.name} icon={item.icon} />
              <Spacer height={20} />
            </>
          ))}
        </View>
        {/* <Spacer height={40} /> */}
        {/* <Spacer height={60} /> */}
      </ScrollView>
      <View
        style={{
          paddingHorizontal: scale(40),paddingTop:20,
          ...commonStyles.rowSpacerBetween,
        }}
      >
        <CustomButton
          title={"Delete User"}
          width={"48%"}
          height={40}
          // fontSize={12}
          fontWeight={"bold"}
          backgroundColor={"red"}
          color={colors.white}
          onPress={deleteAccount}
        />
        <CustomButton
          title={"logout"}
          width={"48%"}
          height={40}
          fontWeight={"bold"}
          backgroundColor={colors.primary}
          color={colors.white}
          onPress={logOff}
        />
      </View>
      <Spacer height={40} />
    </View>
  );
};

const InfoView = ({ label, name, icon }) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      padding: 5,
      // backgroundColor: colors.white,
      shadowColor: Platform.OS == "ios" ? "#ced4da" : colors.black,
      shadowRadius: 5,
      // elevation: 5,
      // alignItems: "center",
      // shadowOpacity: 0.3,

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
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {icon()}
    </View>
    <Spacer width={20} />
    <View>
      <CustomText label={label} fontSize={10} />
      <CustomText label={name} fontSize={14} />
    </View>
  </View>
);
export default Profile;
