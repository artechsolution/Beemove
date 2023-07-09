import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import React from "react";
import { Icon, Button, Header, Input } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import CustomHeader from "../../../components/CustomHeader";
import { colors } from "../../../../Utils/Colors";
import { Spacer } from "../../../components/Spacer";
import CustomText from "../../../components/CustomText";
import { FontAwesome } from "@expo/vector-icons";
import CustomTextInput from "../../../components/CustomTextInput";
import CustomButton from "../../../components/CustomButton";
import { images } from "../../../../assets/images";
import { moderateScale, verticalScale } from "react-native-size-matters";
import DrawerContainer from "../../../components/DrawerContainer";
import commonStyles from "../../../../Utils/CommonStyles";
import { REQUEST_OTP_SUCCESS } from "common/src/store/types";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";

const { height, width } = Dimensions.get("window");

const ConvertToDriver = ({
  navigation,
  onSubmit,
  setState,
  state,
  showActionSheet,
  capturedImage,
  cancelPhoto,
  openDrawer,
  dropDownCars,
  carTypes,
  isRTL,
  appcat,
  setImages,
  officialImages,
  setPhotoName,
}) => {
  const CenterContent = () => (
    <View style={{ flexDirection: "row" }}>
      <FontAwesome
        name="drivers-license-o"
        size={24}
        color={colors.primary}
        style={{ alignSelf: "center" }}
      />
      <Spacer width={10} />
      <CustomText
        label="Convert to Driver"
        alignSelf={"center"}
        fontSize={17}
      />
    </View>
  );
  const ChoosePhoto = ({ capturedImage, photoName,label }) =>
    capturedImage ? (
      <View style={styles.imagePosition}>
        <TouchableOpacity style={styles.photoClick} onPress={()=>cancelPhoto(photoName)}>
          <Image
            source={require("../../../../assets/images/cross.png")}
            resizeMode={"contain"}
            style={styles.imageStyle}
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
            label={label}
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
            <TouchableOpacity
              onPress={() => {
                showActionSheet();
                setPhotoName(photoName);
              }}
              activeOpacity={0.6}
            >
              <AntDesign name="camerao" size={70} color={colors.grayBorder} />
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
    );
  // usertype: 'driver',
  // vehicleNumber: '',
  // vehicleMake:'',
  // vehicleModel: '',
  // carType: null,
  // bankAccount: auth.info && auth.info.profile.bankAccount ? auth.info.profile.bankAccount : '',
  // bankCode: auth.info && auth.info.profile.bankCode? auth.info.profile.bankCode : '',
  // bankName: auth.info && auth.info.profile.bankName? auth.info.profile.bankName : '',
  // licenseImage:null,
  // other_info:'',
  // queue: false,
  // driverActiveStatus: false
  const inputData = [
    {
      id: 1,
      placeholder: "SUV",
      rightLabel: require("../../../../assets/images/car.png"),
      changeValue: (v) => setState({ ...state, carType: v }),
    },
    {
      id: 2,
      placeholder: "Vehicle Name / Brand Name",
      rightLabel: require("../../../../assets/images/car.png"),
      changeValue: (v) => setState({ ...state, vehicleMake: v }),
    },
    {
      id: 3,
      placeholder: "Vehicle Model No",
      rightLabel: require("../../../../assets/images/car.png"),
      changeValue: (v) => setState({ ...state, vehicleModel: v }),
    },
    {
      id: 4,
      placeholder: "Vehicle Rehistration / Plate Number",
      rightLabel: require("../../../../assets/images/car.png"),
      changeValue: (v) => setState({ ...state, vehicleNumber: v }),
    },
    {
      id: 5,
      placeholder: "Other Vehicle or Driver Info",
      rightLabel: require("../../../../assets/images/car.png"),
      changeValue: (v) => setState({ ...state, other_info: v }),
    },
    {
      id: 6,
      placeholder: "Bank Name",
      rightLabel: images.bank,
      changeValue: (v) => setState({ ...state, bankName: v }),
    },
    {
      id: 7,
      placeholder: "Bank Code",
      rightLabel: images.bank,
      changeValue: (v) => setState({ ...state, bankCode: v }),
    },
    {
      id: 7,
      placeholder: "Bank Account",
      rightLabel: images.bank,
      changeValue: (v) => setState({ ...state, bankAccount: v }),
    },
  ];
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <Spacer height={Platform.OS == "ios" ? 40 : 30} />
      <View
        style={{
          //   backgroundColor: colors.primary,
          // height: 80,
          justifyContent: "center",
          width: "auto",
          padding: 15,
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
                style={commonStyles.img}
              />
            </TouchableOpacity>
          )}
          Center={() => <CenterContent />}
        />
      </View>
      <ScrollView>
        <View
          style={[
            styles.textInputContainerStyle,
            { marginBottom: 10, flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        ></View>
        {inputData.map((item, index) => {
          return (
            <>
              {index === 0 ? (
                carTypes ? (
                  <View
                    style={{
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#bdc3c7",
                      overflow: "hidden",
                      width: "90%",
                      alignSelf: "center",
                      height: 55,
                    }}
                  >
                    <RNPickerSelect
                      placeholder={{}}
                      value={state.carType}
                      // useNativeAndroidPickerStyle={false}
                      style={{
                        inputAndroid: [styles.pickerStyle],
                      }}
                      onValueChange={(value) =>
                        setState({ ...state, carType: value })
                      }
                      items={carTypes}
                      // Icon={() => {
                      //   return (
                      //     <Ionicons
                      //       style={{ top: 5, marginRight: isRTL ? "85%" : 0 }}
                      //       name="md-arrow-down"
                      //       size={24}
                      //       color="gray"
                      //     />
                      //   );
                      // }}
                    />
                  </View>
                ) : null
              ) : (
                <View style={{ width: "90%", alignSelf: "center" }}>
                  <CustomTextInput
                    onChangeText={item.changeValue}
                    //   withLabel={item.withLabel}
                    placeholder={item.placeholder}
                    fontSize={12}
                    paddingLeft={20}
                    rightLabel={item.rightLabel}
                    placeholderTextColor={"#9C9C9C"}
                    fontFamily={"Roboto-Light"}
                  />
                </View>
              )}

              <Spacer height={20} />
            </>
          );
        })}

        <ChoosePhoto
          capturedImage={officialImages.license}
          photoName={"license"}
          label={"Upload Your Driving License"}
        />
        <ChoosePhoto
          capturedImage={officialImages.carPhoto}
          photoName={"carPhoto"}
          label={"Upload Your Car Photo"}
        />
        <ChoosePhoto
          capturedImage={officialImages.cr}
          photoName={"cr"}
          label={"Upload Certificate of Registration"}
        />
        <ChoosePhoto
          capturedImage={officialImages.or}
          photoName={"or"}
          label={"Upload Your Official Receipt of Vehicle Registration"}
        />
        <ChoosePhoto
          capturedImage={officialImages.deedOfSale}
          photoName={"deedOfSale"}
          label={"Upload Your Deed of Sale If 2nd, 3rd Owner of Vehicle"}
        />
        <ChoosePhoto
          capturedImage={officialImages.loa}
          photoName={"loa"}
          label={"Upload Your Letter of Authorization If No Deed"}
        />

        <Spacer height={20} />

        <CustomButton
          onPress={onSubmit}
          title={"Submit"}
          width={"50%"}
          height={verticalScale(40)}
          alignSelf={"center"}
        />
        <Spacer height={100} />
      </ScrollView>
    </View>
  );
};

export default ConvertToDriver;

const styles = StyleSheet.create({
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
    height: height / 4,
  },
  imagePosition: {
    position: "relative",
  },
  photoClick: {
    paddingRight: 48,
    position: "absolute",
    zIndex: 1,
    marginTop: 18,
    alignSelf: "flex-end",
  },
  capturePicClick: {
    backgroundColor: colors.WHITE,
    flexDirection: "row",
    position: "relative",
    zIndex: 1,
  },
  imageStyle: {
    width: 30,
    height: height / 15,
  },
  pickerStyle: {
    width: "100%",
    height: "100%",
    fontSize: 15,
    alignSelf: "center",
    backgroundColor: colors.gray1,
  },
});
