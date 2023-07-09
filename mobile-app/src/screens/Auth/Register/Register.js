import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import commonStyles from "../../../../Utils/CommonStyles";
import { Spacer } from "../../../components/Spacer";
import TopHeader from "../../../components/TopHeader";
import PercentageSpacer from "../../../components/PercentageSpacer";
import CustomTextInput from "../../../components/CustomTextInput";
import CustomButton from "../../../components/CustomButton";
import CustomText from "../../../components/CustomText";
import { colors } from "../../../../Utils/Colors";
import { NavigationContainer } from "@react-navigation/native";
import RegisterCheck from "./Molecules/RegisterCheck";
import { images } from "../../../../assets/images";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import PhoneInput from "react-native-phone-number-input";
import { scale } from "react-native-size-matters";
import RNPickerSelect from "react-native-picker-select";
import RadioForm from "react-native-simple-radio-button";

const Register = ({
  navigation,
  state,
  setState,
  onPressRegister,
  capturedImage,
  showActionSheet,
  cancelPhoto,
  dropDownCars,
  radio_props,
}) => {
  const [check, setCheck] = useState("rider");
  const CheckData = ["rider", "driver"];
  const [countryCode, setCountryCode] = useState("");

  const CustomerInput = [
    {
      id: 1,
      placeholder: "First Name",
      rightLabel: require("../../../../assets/images/user.png"),
      onChange: (v) => setState({ ...state, firstName: v }),
    },
    {
      id: 2,
      placeholder: "Last Name",
      rightLabel: require("../../../../assets/images/user.png"),
      onChange: (v) => setState({ ...state, lastName: v }),
    },
    // {
    //   id: 3,
    //   placeholder: "Country Code",
    //   rightLabel: require("../../../../assets/images/user.png"),
    //   onChange: (v) => (setState({...state, lastName: v})),
    // },
    {
      id: 4,
      placeholder: "Phone Number",
      rightLabel: require("../../../../assets/images/user.png"),
      onChange: (v) => setState({ ...state, mobile: v }),
    },
    {
      id: 5,
      placeholder: "Email",
      rightLabel: require("../../../../assets/images/email.png"),
      onChange: (v) => setState({ ...state, email: v }),
    },

    // {
    //   id: 5,
    //   placeholder: "Password",
    //   rightLabel: require("../../../../assets/images/lock.png"),
    //   onChange: (v) => (setState({...state, setState: v})),
    // },
    // {
    //   id: 6,
    //   placeholder: "Confirm Password",
    //   rightLabel: require("../../../../assets/images/lock.png"),
    //   onChange: (v) => (setState({...state, setState: v})),
    // },
  ];

  const DriverInput = [
    {
      id: 1,
      placeholder: "First Name",
      rightLabel: require("../../../../assets/images/user.png"),
      onChange: (v) => setState({ ...state, firstName: v }),
    },
    {
      id: 2,
      placeholder: "Last Name",
      rightLabel: require("../../../../assets/images/user.png"),
      onChange: (v) => setState({ ...state, lastName: v }),
    },
    {
      id: 3,
      placeholder: "Email",
      rightLabel: require("../../../../assets/images/email.png"),
      onChange: (v) => setState({ ...state, email: v }),
    },

    {
      id: 4,
      placeholder: "Phone Number",
      rightLabel: require("../../../../assets/images/user.png"),
      onChange: (v) => setState({ ...state, mobile: v }),
    },
    {
      id: 5,
      placeholder: "SUV",
      rightLabel: require("../../../../assets/images/car.png"),
      onChange: (v) => setState({ ...state, carType: v }),
    },
    {
      id: 6,
      placeholder: "Vehicle Name / Brand Name",
      rightLabel: require("../../../../assets/images/car.png"),
      onChange: (v) => setState({ ...state, vehicleMake: v }),
    },
    {
      id: 7,
      placeholder: "Vehicle Model No",
      rightLabel: require("../../../../assets/images/car.png"),
      onChange: (v) => setState({ ...state, vehicleModel: v }),
    },
    {
      id: 8,
      placeholder: "Vehicle Rehistration / Plate Number",
      rightLabel: require("../../../../assets/images/car.png"),
      onChange: (v) => setState({ ...state, vehicleNumber: v }),
    },
    {
      id: 9,
      placeholder: "Other Vehicle or Driver Info",
      rightLabel: require("../../../../assets/images/car.png"),
      onChange: (v) => setState({ ...state, other_info: v }),
    },
    {
      id: 10,
      placeholder: "Bank Name",
      rightLabel: images.bank,
      onChange: (v) => setState({ ...state, bankName: v }),
    },
    {
      id: 11,
      placeholder: "Bank Code",
      rightLabel: images.bank,
      onChange: (v) => setState({ ...state, bankCode: v }),
    },
    {
      id: 12,
      placeholder: "Bank Account",
      rightLabel: images.bank,
      onChange: (v) => setState({ ...state, bankName: v }),
    },
  ];

  const openRegister = () => {
    navigation.navigate("Login");
  };
  return (
    <SafeAreaView style={{ backgroundColor: colors.white }}>
      <Spacer height={Platform.OS == "ios" ? 0 : 5} />

      <ScrollView showsVerticalScrollIndicator={false} style={{}}>
        {/* {uploadImage()} */}
        {/* <Spacer height={10} /> */}
        <View style={commonStyles.PH30}>
          <TopHeader
            label1={"Register"}
            navigation={navigation}
            img={require("../../../../assets/images/appLogo.png")}
            label2="Make vour own account with Beemove"
          />
        </View>
        {/* <PercentageSpacer height={"7%"} /> */}
        {/* <Spacer height={20}/> */}
        <Spacer height={20} />
        <View style={commonStyles.PH30}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("../../../../assets/images/user.png")}
              style={{ width: 20, height: 20 }}
            />

            {/* {CheckData.map((item) => {
              return (
                <>
                  <RegisterCheck
                    item={item}
                    check={check}
                    setCheck={setCheck}
                  //   onPress={(value) => {
                  //     if(value==0){
                  //         setState({...state, usertype: 'rider' });
                  //     }else{
                  //         setState({...state, usertype: 'driver' });
                  //     }
                  // }}
                    // state={state}
                    // setState={setState}
                  />
                </>
              );
            })} */}

            <RadioForm
              radio_props={radio_props}
              initial={0}
              animation={false}
              formHorizontal={true}
              labelHorizontal={true}
              selectedButtonColor={colors.primary}
              buttonColor={colors.primary}
              buttonSize={15}
              onPress={(value) => {
                if (value == 0) {
                  setState({ ...state, usertype: "rider" });
                } else {
                  setState({ ...state, usertype: "driver" });
                }
              }}
            />
          </View>
        </View>
        <Spacer height={20} />

        {state.usertype == "rider"
          ? CustomerInput.map((item) => {
              return item.placeholder === "Phone Number" ? (
                <PhoneInput
                  onChangeText={(num) => {
                    if (num.charAt(0) == 0) {
                      console.log("numValue", num);
                    } else {
                      console.log("numValue", num);
                      setState({ ...state, mobile: countryCode + num });
                    }
                  }}
                  onChangeCountry={(country) => {
                    let countryCodeValue = "+" + country.callingCode[0];
                    console.log("CodeCountry", countryCodeValue);
                    setCountryCode(countryCodeValue);
                    // setState({ ...state, countryCode: countryCodeValue });
                  }}
                  containerStyle={{
                    backgroundColor: colors.lightGray,
                    // borderColor: colors.darkGray,
                    borderWidth: 0.5,
                    borderColor: "#707070",
                    borderRadius: scale(8),
                    width: "82.5%",
                    alignSelf: "center",
                    marginBottom: 30,
                    marginTop: -6,
                  }}
                  textContainerStyle={{
                    backgroundColor: colors.lightGray,
                    borderRadius: scale(8),
                  }}
                />
              ) : (
                <View style={commonStyles.PH30}>
                  <CustomTextInput
                    placeholder={item.placeholder}
                    fontSize={12}
                    paddingLeft={20}
                    rightLabel={item.rightLabel}
                    // paddingTop={10}
                    placeholderTextColor={"#9C9C9C"}
                    fontFamily={"Roboto-Light"}
                    onChangeText={item.onChange}
                  />
                  <Spacer height={30} />
                </View>
              );
            })
          : DriverInput.map((item) => {
              return item.placeholder === "Phone Number" ? (
                <PhoneInput
                  onChangeText={(num) => {
                    if (num.charAt(0) == 0) {
                      console.log("numValue", num);
                    } else {
                      console.log("numValue", num);
                      setState({ ...state, mobile: countryCode + num });
                    }
                  }}
                  onChangeCountry={(country) => {
                    let countryCodeValue = "+" + country.callingCode[0];
                    console.log("CodeCountry", countryCodeValue);
                    setCountryCode(countryCodeValue);
                    // setState({ ...state, countryCode: countryCodeValue });
                  }}
                  containerStyle={{
                    backgroundColor: colors.lightGray,
                    // borderColor: colors.darkGray,
                    borderWidth: 0.5,
                    borderColor: "#707070",
                    borderRadius: scale(8),
                    width: "82.5%",
                    alignSelf: "center",
                    marginBottom: 30,
                    marginTop: -5,
                    // height:10
                  }}
                  textContainerStyle={{
                    backgroundColor: colors.lightGray,
                    borderRadius: scale(8),
                  }}
                />
              ) : item.placeholder === "SUV" ? (
                <View>
                  <View
                    style={{
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#bdc3c7",
                      overflow: "hidden",
                      width: "82%",
                      alignSelf: "center",
                      height: 55,
                    }}
                  >
                    <RNPickerSelect
                      value={state.carType}
                      items={dropDownCars}
                      onValueChange={item.onChange}
                      style={{
                        inputAndroid: [styles.pickerStyle],
                      }}
                    />
                  </View>
                  <Spacer height={30} />
                </View>
              ) : (
                <View style={commonStyles.PH30}>
                  <CustomTextInput
                    onChangeText={item.onChange}
                    placeholder={item.placeholder}
                    fontSize={12}
                    paddingLeft={20}
                    rightLabel={item.rightLabel}
                    // paddingTop={10}
                    placeholderTextColor={"#9C9C9C"}
                    fontFamily={"Roboto-Light"}
                  />
                  <Spacer height={30} />
                </View>
              );
            })}

        {state.usertype == "driver" ? (
          capturedImage ? (
            <View>
              <TouchableOpacity
                style={{
                  paddingRight: 48,
                  position: "absolute",
                  zIndex: 10,
                  marginTop: 18,
                  alignSelf: "flex-end",
                }}
              >
                <Entypo
                  name="circle-with-cross"
                  size={24}
                  color="black"
                  onPress={cancelPhoto}
                />
              </TouchableOpacity>
              <Image
                source={{ uri: capturedImage }}
                style={styles.photoResult}
                resizeMode={"cover"}
              />
            </View>
          ) : (
            <TouchableOpacity activeOpacity={0.6}>
              <View
                style={{
                  width: "80%",
                  height: 140,
                  backgroundColor: colors.white,
                  borderRadius: 10,
                  alignSelf: "center",
                }}
              >
                <CustomText
                  label="Upload Your Driving License"
                  alignSelf={"center"}
                  marginTop={10}
                  color={colors.primary}
                />
                <Spacer height={15} />
                <View
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity onPress={showActionSheet}>
                    <AntDesign
                      name="camerao"
                      size={70}
                      color={colors.grayBorder}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      height: 40,
                      width: 1,
                      backgroundColor: colors.black,
                    }}
                  />
                  <CustomText label="(Image Size: Max 2MB)" />
                </View>
              </View>
            </TouchableOpacity>
          )
        ) : null}

        <View style={commonStyles.PH30}>
          <Spacer height={40} />
          <CustomButton
            title="Register"
            fontFamily={"Roboto-Regular"}
            onPress={onPressRegister}
          />
          <Spacer height={20} />

          <TouchableOpacity
          activeOpacity={0.7}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              openRegister();
            }}
          >
            <CustomText
              label="Already have an account?"
              color={colors.lightBlack}
              fontFamily={"Roboto-Regular"}
              fontSize={12}
            />
            <CustomText
              label="Login"
              color={colors.primary}
              marginLeft={2}
              fontFamily={"Roboto-Bold"}
              fontSize={12}
            />
          </TouchableOpacity>
        </View>
        <Spacer height={100} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;

// const styles = StyleSheet.create({

// });

const styles = {
  photoResult: {
    alignSelf: "center",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 15,
    paddingBottom: 10,
    marginTop: 15,
    width: "80%",
    height: 150,
  },
  pickerStyle: {
    // color: "white",
    width: "100%",
    fontSize: 15,
    // height: 40,
    alignSelf: "center",
    // borderRadius:20,
    // marginLeft: 20,
    // marginTop: 8,
    // borderBottomWidth: 1,
    // borderBottomColor: colors.red,
    // borderWidth: 0.5,
    // borderColor: 'purple',
    // borderRadius: 8,
    backgroundColor: colors.gray1,
  },
};
