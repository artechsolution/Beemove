import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import { colors } from "../../../../Utils/Colors";
import { AntDesign } from "@expo/vector-icons";
import CustomText from "../../../components/CustomText";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import CustomHeader from "../../../components/CustomHeader";
import { images } from "../../../../assets/images";
import { Spacer } from "../../../components/Spacer";
import { CheckBox } from "react-native-elements";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import commonStyles from "../../../../Utils/CommonStyles";
import CustomButton from "../../../components/CustomButton";

const PaymentScreen = ({
  navigation,
  goBack,
  userdata,
  payDetails,
  booking,
  appcat,
  isRTL,
  settings,
  useWalletCash,
  providers,
  isLoading,
  doPayment,
  openPromoModal,
  removePromo
}) => {
  const [isOn, setisOn] = useState(true);
  const [check, setCheck] = useState(false);
  const BlurCircle = () => (
    <View
      style={{
        borderRadius: 30,
        borderWidth: 2,
        borderColor: "#8EB4FF",
        padding: 2,
        width: 18,
        height: 18,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          borderRadius: 30,
          backgroundColor: "#8EB4FF",
          width: 10,
          height: 10,
        }}
      ></View>
    </View>
  );
  return (
    <SafeAreaView
      style={{ display: "flex", flex: 1, backgroundColor: colors.white }}
    >
      <View
        style={{
          backgroundColor: colors.white,
          height: 80,
          justifyContent: "center",
          width: "auto",
          paddingHorizontal: 15,
        }}
      >
        <Spacer height={Platform.OS=="android"? 20:0}/>
        <CustomHeader
          LeftSide={() => (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={goBack}
            >
              <MaterialIcons
                name="arrow-back"
                size={moderateScale(25)}
                color="black"
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
              <MaterialIcons name="payment" color={colors.primary} size={20} />
              <Spacer width={10} />
              <CustomText
                label="Payment"
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
      <View
        style={{
          flex: 1,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ImageBackground
          source={images.bill}
          style={{
            width: "100%",
            height: Dimensions.get("window").height / 1.2,
          }}
          // resizeMode={"contain"}
        >
          <Spacer height={20} />
          <View style={{  flexDirection:isRTL?'row-reverse':'row', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 20, marginBottom: 4 }}>
          <CustomText label="Bill Details" fontSize={14} />
              {userdata && userdata.usertype == 'rider' && (booking.status == 'PAYMENT_PENDING' || (appcat == 'taxi' && booking.status == "PENDING") || (booking.status == 'NEW' && appcat == 'rentals'))? 
                payDetails.promo_applied ?
                <TouchableOpacity
                  onPress={() => { removePromo() }}>
                  <Text style={{ color: 'red',fontWeight: '500' }}>Remove Promo</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity
                  onPress={() => { openPromoModal() }}>
                  <Text style={{ color: colors.primary, fontWeight: '500' }}>Apply Promo</Text>
                </TouchableOpacity>
              : null}
          </View>
          {userdata && userdata.usertype == "driver" ? (
            <View style={{ paddingLeft: 25, paddingRight: 25 }}>
              <View
                style={[
                  styles.location,
                  { flexDirection: isRTL ? "row-reverse" : "row" },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <BlurCircle />
                  </View>
                  <View style={{ flex: 9 }}>
                    {booking && booking.trip_start_time ? (
                      <View>
                        <Text>{booking.trip_start_time}</Text>
                      </View>
                    ) : null}
                    {booking && booking.pickup ? (
                      <View>
                        <View />
                        <Text>{booking.pickup.add}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.location,
                  { flexDirection: isRTL ? "row-reverse" : "row" },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ height: 30, width: 30, flex: 1 }}>
                    <Image
                      source={require("../../../../assets/images/location.png")}
                      style={{ height: 20, width: 20 }}
                      resizeMode={"contain"}
                    />
                  </View>
                  <View style={{ flex: 9 }}>
                    {booking && booking.trip_end_time ? (
                      <View>
                        <Text>{booking.trip_end_time}</Text>
                      </View>
                    ) : null}
                    {booking && booking.drop ? (
                      <View>
                        <View />
                        <Text>{booking.drop.add}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            </View>
          ) : null}
          {userdata && userdata.usertype == 'driver' ?
            <View style={{  flexDirection:isRTL?'row-reverse':'row', justifyContent: 'space-between', paddingLeft: 25, paddingRight: 25 }}>
              <Text style={{ color: colors.BLACK, textAlign:isRTL?'right': 'left', lineHeight: 45, fontSize: 16 }}>Distance</Text>
              <Text style={{ color: colors.BLACK, textAlign: isRTL?'right':'left', lineHeight: 45, fontSize: 16 }}>
                {
                  (booking && booking.distance ? booking.distance :  '0') + ' ' + (settings && settings.convert_to_mile? 'Mile' :"Km")
                }
              </Text>
            </View>
            : null}
            {userdata && userdata.usertype == 'driver' ?
            <View style={{  flexDirection:isRTL?'row-reverse':'row', justifyContent: 'space-between', paddingLeft: 25, paddingRight: 25 }}>
              <Text style={{ color: colors.BLACK, textAlign:isRTL?'right': 'left', lineHeight: 45, fontSize: 16 }}>Total Time</Text>
              <Text style={{ color: colors.BLACK, textAlign:isRTL?'right': 'left', lineHeight: 45, fontSize: 16 }}>{(booking && booking.total_trip_time ? parseFloat(booking.total_trip_time / 60).toFixed(1)  : '0') + ' ' + 'Mins'}</Text>
            </View>
            : null}
            {userdata && userdata.usertype == 'driver' ?
            <View style={{
              borderStyle: 'dotted',
              borderWidth: 0.5,
              borderRadius: 1,
              marginBottom: 20
            }}>
            </View>
            : null}
            {userdata ?
            <View style={{ flexDirection: isRTL?'row-reverse':'row', justifyContent: 'space-between', paddingLeft: 25, paddingRight: 25 }}>
              <Text style={{ color: colors.BLACK, textAlign: isRTL?'right':'left', lineHeight: 45, fontSize: 16 }}>{userdata.usertype == 'rider' ? 'Your Fare': "Total Fare"}</Text>
              {settings.swipe_symbol===false?
                <Text style={{ color: colors.BLACK, textAlign: isRTL?'right':'left', lineHeight: 45, fontSize: 16 }}>{settings.symbol} {parseFloat(payDetails.amount).toFixed(settings.decimal)}</Text>
                :
                <Text style={{ color: colors.BLACK, textAlign: isRTL?'right':'left', lineHeight: 45, fontSize: 16 }}>{parseFloat(payDetails.amount).toFixed(settings.decimal)} {settings.symbol}</Text>
              }
            </View>
            : null
          }
          {userdata ?
            <View style={{ flexDirection:isRTL?'row-reverse': 'row', justifyContent: 'space-between', paddingLeft: 25, paddingRight: 25 }}>
              <Text style={{ color: colors.BLACK, textAlign: isRTL?'right':'left', lineHeight: 45, fontSize: 16 }}>Promo Discount</Text>
              {settings.swipe_symbol===false?
                <Text style={{ color: colors.DULL_RED, textAlign:isRTL?'right': 'left', lineHeight: 45, fontSize: 16 }}>{isRTL? null:'-'} {settings.symbol} {payDetails ? payDetails.discount ? parseFloat(payDetails.discount).toFixed(settings.decimal) : '0.00' : '0.00'} {isRTL? '-':null}</Text>
                :
                <Text style={{ color: colors.DULL_RED, textAlign:isRTL?'right': 'left', lineHeight: 45, fontSize: 16 }}>{isRTL? null:'-'} {payDetails ? payDetails.discount ? parseFloat(payDetails.discount).toFixed(settings.decimal) : '0.00' : '0.00'} {settings.symbol} {isRTL? '-':null}</Text>
              }
            </View>
            : null}
            {useWalletCash || (booking.status != 'PAYMENT_PENDING' && booking.usedWalletMoney)?
            <View style={{  flexDirection: isRTL?'row-reverse':'row', justifyContent: 'space-between', paddingLeft: 25, paddingRight: 25 }}>
              <Text style={{ color: colors.BLACK, textAlign: isRTL?'right':'left', lineHeight: 45, fontSize: 16 }}>WalletPayment</Text>
              {settings.swipe_symbol===false?
                <Text style={{ color: colors.DULL_RED, textAlign: isRTL?'right':'left', lineHeight: 45, fontSize: 16 }}>{isRTL? null:'-'} {settings.symbol} {payDetails ? payDetails.usedWalletMoney ? parseFloat(payDetails.usedWalletMoney).toFixed(settings.decimal) : '0.00' : '0.00'} {isRTL? '-':null}</Text>
                :
                <Text style={{ color: colors.DULL_RED, textAlign: isRTL?'right':'left', lineHeight: 45, fontSize: 16 }}>{isRTL? null:'-'} {payDetails ? payDetails.usedWalletMoney ? parseFloat(payDetails.usedWalletMoney).toFixed(settings.decimal) : '0.00' : '0.00'} {settings.symbol} {isRTL? '-':null}</Text>
              }
            </View> : null}
            {userdata && userdata.usertype == 'rider'  && ((booking.status == 'NEW' && appcat=='rentals') ||booking.status == 'PAYMENT_PENDING' || (appcat == 'taxi' && booking.status == "PENDING"))? 
            <View style={{  }}>
              <CheckBox
                center
                disabled={parseFloat(userdata.walletBalance) > 0 ? false : true}
                title={settings.swipe_symbol===false? 'Use Wallet Cash (Your Balance is ' + settings.symbol + (parseFloat(userdata.walletBalance) - parseFloat(payDetails.usedWalletMoney)).toFixed(settings.decimal) + ')'
                  : 'wallet_balance' + (parseFloat(userdata.walletBalance) - parseFloat(payDetails.usedWalletMoney)).toFixed(settings.decimal) + settings.symbol + ')'}
                checked={useWalletCash}
                containerStyle={{ backgroundColor: colors.WHITE, borderWidth: 0, borderColor: colors.WHITE, alignSelf: isRTL? 'flex-end':'flex-start' }}
                onPress={() => { useWallet() }}>
              </CheckBox>

            </View>
            : null}

{userdata ?
            <View style={{
              borderStyle: 'dotted',
              borderWidth: 0.5,
              borderRadius: 1,  
            }}>
            </View>
            : null}
            {userdata ?
            <View style={{  flexDirection: isRTL?'row-reverse':'row', justifyContent: 'space-between', paddingLeft: 25, paddingRight: 25 }}>
              <Text style={{ color: colors.primary, textAlign:isRTL?'right':'left', lineHeight: 45, fontSize: 24, fontWeight: '500' }}>Payable</Text>
              {settings.swipe_symbol===false?
                <Text style={{ color: colors.primary, textAlign:isRTL?'right':'left', lineHeight: 45, fontSize: 24, fontWeight: 'bold' }}>{settings.symbol} {payDetails.payableAmount ? parseFloat(payDetails.payableAmount).toFixed(settings.decimal) : 0.00}</Text>
                :
                <Text style={{ color: colors.primary, textAlign:isRTL?'right':'left', lineHeight: 45, fontSize: 24, fontWeight: 'bold' }}>{payDetails.payableAmount ? parseFloat(payDetails.payableAmount).toFixed(settings.decimal) : 0.00} {settings.symbol}</Text>
              }
            </View>
            : null}

{payDetails.payableAmount == 0 ?
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonWrapper2}
              onPress={() => {
                doPayment('wallet');
              }}>
              <Text style={styles.buttonTitle}>{userdata && userdata.usertype == 'rider'?'paynow_button':'ok'}</Text>
            </TouchableOpacity>
          </View>
          :
          <View style={[styles.buttonContainer,{flexDirection:isRTL? 'row-reverse':'row'}]}>
            {appcat !=='rentals'?
            <CustomButton
            title={booking.status=='PAYMENT_PENDING'?'Cash on Delivery':'Pay Cash'}
            width={"35%"}
            height={40}
            fontSize={12}
            // fontWeight={"bold"}
            backgroundColor={colors.primary}
            onPress={() => {
              doPayment('cash');
            }}
          />
            
            :null}
            <Spacer width={20}/>
            {providers && providers.length > 0 ?
            <CustomButton
            title={userdata && userdata.usertype == 'rider' ? 'Pay With Card' : 'Request Payment'}
            width={"35%"}
            height={40}
            // onPress={() => navigation.navigate("Receipt")}
            fontSize={12}
            // fontWeight={"bold"}
            backgroundColor={colors.white}
            onPress={() => {
              doPayment('card');
            }}
          />
              
            : null}
          </View>
        }

        {/* //!===========><============ */}
        {/* //!===========><============ */}
        {/* //!===========><============ */}
          {/* <View style={{ width: "auto", padding: 20 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View>
                <CustomText label="Bill Details" fontSize={14} />
                <Spacer height={14} />
                <CustomText label="Your Fare" fontSize={11} />
                <Spacer height={14} />
                <CustomText label="Promo Discount" fontSize={11} />
                <Spacer height={14} />
              </View>
              <View>
                <CustomText
                  label="Apply Promo"
                  fontSize={10}
                  color={colors.primary}
                />
                {userdata &&
                userdata.usertype == "rider" &&
                (booking.status == "PAYMENT_PENDING" ||
                  (appcat == "taxi" && booking.status == "PENDING") ||
                  (booking.status == "NEW" && appcat == "rentals")) ? (
                  payDetails.promo_applied ? (
                    <TouchableOpacity
                      onPress={() => {
                        removePromo();
                      }}
                    >
                      <Text
                        style={{
                          color: "red",
                          textAlign: isRTL ? "right" : "left",
                          lineHeight: 45,
                          fontSize: 14,
                          fontWeight: "500",
                        }}
                      >
                        Remove Promo
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        openPromoModal();
                      }}
                    >
                      <Text
                        style={{
                          color: colors.primary,
                          textAlign: isRTL ? "right" : "left",
                          lineHeight: 45,
                          fontSize: 14,
                          fontWeight: "500",
                        }}
                      >
                        Apply Promo
                      </Text>
                    </TouchableOpacity>
                  )
                ) : (
                  <Text></Text>
                )}
                <Spacer height={17} />
                <CustomText label="$ 23.00" fontSize={11} />
                <Spacer height={17} />
                <CustomText label="-$0.00" fontSize={11} />
              </View>
            </View>

            <View style={{ display: "flex", flexDirection: "row" }}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => setCheck(!check)}
                style={styles.checkContainer}
              >
                {check ? (
                  <Ionicons
                    name="checkmark-sharp"
                    size={moderateScale(20)}
                    color={colors.primary}
                  />
                ) : (
                  <></>
                )}
              </TouchableOpacity>
              <Spacer width={10} />
              <View style={{ alignSelf: "center" }}>
                <CustomText label="Use Wallet Cash (Your Balance is $274.00)" />
              </View>
            </View>
            <Spacer height={10} />

            <View
              style={{
                height: 1,
                width: "100%",
                backgroundColor: colors.lightText,
              }}
            />
            <Spacer height={10} />
            <View
              style={{ ...commonStyles.rowSpacerBetween, paddingRight: 20 }}
            >
              <CustomText
                label="Bill Details"
                fontSize={14}
                color={colors.lightText}
              />
              <CustomText
                label="$23.00"
                fontSize={14}
                color={colors.lightText}
              />
            </View>
            <Spacer height={30} />
            <View style={commonStyles.rowContainer}>
              <CustomButton
                title={"Pay with Cash"}
                width={"40%"}
                height={40}
                fontSize={12}
                backgroundColor={colors.primary}
              />
              <Spacer width={10} />
              <CustomButton
                title={"Pay with Card"}
                width={"40%"}
                height={40}
                onPress={() => navigation.navigate("Receipt")}
                fontSize={12}
                backgroundColor={colors.white}
              />
            </View>
          </View> */}
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

var { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  checkContainer: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.grayBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // !originalStyles

  mainView: {
    flex: 1,
    backgroundColor: colors.WHITE,
    //marginTop: StatusBar.currentHeight
  },
  headerStyle: {
    backgroundColor: colors.HEADER,
    borderBottomWidth: 0,
  },
  headerTitleStyle: {
    color: colors.WHITE,
    fontFamily: "Roboto-Bold",
    fontSize: 20,
  },
  scrollStyle: {
    flex: 1,
    height: height,
    backgroundColor: colors.WHITE,
  },
  container: {
    flex: 1,
    marginTop: 5,
    backgroundColor: "white",
  },
  buttonContainer: {
    width: "100%",
    //position: 'absolute',
    //bottom: 10
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  buttonWrapper: {
    marginHorizontal: 6,
    //marginBottom: 15,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.BUTTON_BACKGROUND,
    borderRadius: 8,
    marginTop: 10,
    paddingHorizontal: 15,
  },
  cardPayBtn: {
    marginHorizontal: 6,
    height: 55,
    borderRadius: 8,
    marginTop: 10,
  },
  cardPayBtnInnner: {
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.PAYMENT_BUTTON_BLUE,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  buttonWrapper2: {
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 10,
    marginTop: 20,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.BUTTON_BACKGROUND,
    borderRadius: 8,
    width: "90%",
  },
  buttonTitle: {
    color: colors.WHITE,
    fontSize: 18,
  },
  newname: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  emailInputContainer: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingLeft: 10,
    backgroundColor: colors.WHITE,
    paddingRight: 10,
    paddingTop: 10,
    width: width - 80,
  },
  errorMessageStyle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  inputTextStyle: {
    color: colors.BLACK,
    fontSize: 16,
  },
  pinbuttonStyle: {
    elevation: 0,
    bottom: 15,
    width: "80%",
    alignSelf: "center",
    borderRadius: 20,
    borderColor: "transparent",
    backgroundColor: colors.BUTTON_RIGHT,
  },
  pinbuttonContainer: { flex: 1, justifyContent: "center" },
  inputContainer: { flex: 3, justifyContent: "center", marginTop: 40 },
  pinheaderContainer: {
    height: 250,
    backgroundColor: colors.WHITE,
    width: "80%",
    justifyContent: "space-evenly",
  },
  pinheaderStyle: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: colors.HEADER,
    justifyContent: "center",
  },
  forgotPassText: {
    textAlign: "center",
    color: colors.WHITE,
    fontSize: 20,
    width: "100%",
  },
  pinContainer: { flexDirection: "row", justifyContent: "space-between" },
  forgotStyle: { flex: 3, justifyContent: "center", alignItems: "center" },
  crossIconContainer: { flex: 1, left: "40%" },
  forgot: { flex: 1 },
  pinbuttonTitle: {
    fontWeight: "bold",
    fontSize: 18,
    width: "100%",
    textAlign: "center",
  },
  newname2: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  emailInputContainer2: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingLeft: 10,
    backgroundColor: colors.WHITE,
    paddingRight: 10,
    paddingTop: 10,
    width: width - 80,
  },

  inputTextStyle2: {
    color: colors.BLACK,
    fontSize: 14,
  },
  buttonStyle2: {
    elevation: 0,
    bottom: 15,
    width: "80%",
    alignSelf: "center",
    borderRadius: 20,
    borderColor: "transparent",
    backgroundColor: colors.BUTTON_RIGHT,
  },
  buttonContainer2: { flex: 1, justifyContent: "center", marginTop: 5 },
  inputContainer2: { flex: 4, paddingBottom: 25 },
  headerContainer2: {
    height: 380,
    backgroundColor: colors.WHITE,
    width: "80%",
    justifyContent: "center",
  },
  headerStyle2: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: colors.HEADER,
    justifyContent: "center",
  },
  forgotPassText2: {
    textAlign: "center",
    color: colors.WHITE,
    fontSize: 16,
    width: "100%",
  },
  forgotContainer2: { flexDirection: "row", justifyContent: "space-between" },
  forgotStyle2: { flex: 3, justifyContent: "center" },
  crossIconContainer2: { flex: 1, left: "40%" },
  forgot2: { flex: 1 },
  buttonTitle2: {
    fontWeight: "bold",
    fontSize: 16,
    width: "100%",
    textAlign: "center",
  },

  containercvv: {
    flex: 1,
    width: "100%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingTop: 120,
  },
  modalContainercvv: {
    height: 200,
    backgroundColor: colors.WHITE,
    width: "80%",
    borderRadius: 10,
    elevation: 15,
  },
  crossIconContainercvv: {
    flex: 1,
    left: "40%",
  },
  blankViewStylecvv: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    marginTop: 15,
    marginRight: 15,
  },
  blankViewStyleOTP: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  modalHeaderStylecvv: {
    textAlign: "center",
    fontSize: 20,
    paddingTop: 10,
  },
  modalContainerViewStylecvv: {
    flex: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  itemsViewStylecvv: {
    flexDirection: "column",
    // justifyContent: "space-between"
  },
  textStylecvv: {
    fontSize: 20,
  },
  location: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 6,
  },
  timeStyle: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    marginTop: 1,
  },
  greenDot: {
    backgroundColor: colors.GREEN_DOT,
    width: 10,
    height: 10,
    borderRadius: 50,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  redDot: {
    backgroundColor: colors.RED,
    width: 10,
    height: 10,
    borderRadius: 50,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  address: {
    flexDirection: "row",
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: 0,
    marginLeft: 6,
  },
  adressStyle: {
    marginLeft: 6,
    fontSize: 15,
    lineHeight: 20,
  },
});

export default PaymentScreen;