import React, { useState, useRef, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  TextInput,
  Image,
  ActivityIndicator,
  Platform,
  Linking,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import MaterialButtonDark from "../components/MaterialButtonDark";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { FirebaseContext } from "common/src";
import { colors } from "../common/theme";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import RNPickerSelect from "react-native-picker-select";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import i18n from "i18n-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment/min/moment-with-locales";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import commonStyles from "../../Utils/CommonStyles";
import PercentageSpacer from "../components/PercentageSpacer";
import PhoneMainContainer from "./Auth/Register/PhoneNumber/Molecules/PhoneMainContainer";
import LoginBottom from "./Auth/Login/Molecules/LoginBottom";
import OtpScreen from "./Auth/Register/Otp/OtpScreen";
import CustomText from "../components/CustomText";

export default function LoginScreen(props) {
  const { api, config } = useContext(FirebaseContext);
  const {
    clearLoginError,
    requestPhoneOtpDevice,
    mobileSignIn,
    countries,
    facebookSignIn,
    appleSignIn,
    requestEmailOtp,
    verifyEmailOtp,
  } = api;
  const auth = useSelector((state) => state.auth);
  const settings = useSelector((state) => state.settingsdata.settings);
  const dispatch = useDispatch();

  const formatCountries = () => {
    let arr = [];
    for (let i = 0; i < countries.length; i++) {
      let txt = countries[i].label + " (+" + countries[i].phone + ")";
      arr.push({ label: txt, value: txt, key: txt });
    }
    return arr;
  };

  const [state, setState] = useState({
    entryType: null,
    contact: null,
    verificationId: null,
    verificationCode: null,
    countryCodeList: formatCountries(),
    countryCode: null,
  });
  console.log("countryCodeList", state.contact);

  const pageActive = useRef(false);
  const [loading, setLoading] = useState(false);
  const recaptchaVerifier = useRef(null);

  const { t } = i18n;
  const [isRTL, setIsRTL] = useState();
  const [langSelection, setLangSelection] = useState();
  const languagedata = useSelector((state) => state.languagedata);

  useEffect(() => {
    AsyncStorage.getItem("lang", (err, result) => {
      if (result) {
        const langLocale = JSON.parse(result)["langLocale"];
        setIsRTL(langLocale == "he" || langLocale == "ar");
        setLangSelection(langLocale);
      } else {
        setIsRTL(
          i18n.locale.indexOf("he") === 0 || i18n.locale.indexOf("ar") === 0
        );
        setLangSelection(i18n.locale);
      }
    });
  }, []);

  useEffect(() => {
    if (settings) {
      for (let i = 0; i < countries.length; i++) {
        if (countries[i].label == settings.country) {
          setState({
            ...state,
            countryCode: settings.country + " (+" + countries[i].phone + ")",
          });
        }
      }
    }
  }, [settings]);

  useEffect(() => {
    if (auth.info && pageActive.current) {
      pageActive.current = false;
      setLoading(false);
    }
    if (
      auth.error &&
      auth.error.msg &&
      pageActive.current &&
      auth.error.msg.message !== t("not_logged_in")
    ) {
      pageActive.current = false;
      setState({ ...state, verificationCode: "" });
      if (auth.error.msg.message === t("require_approval")) {
        Alert.alert(t("alert"), t("require_approval"));
      } else {
        Alert.alert(t("alert"), t("login_error"));
      }
      dispatch(clearLoginError());
      setLoading(false);
    }
    if (auth.verificationId) {
      pageActive.current = false;
      setState({ ...state, verificationId: auth.verificationId });
      setLoading(false);
    }
  }, [auth.info, auth.error, auth.error.msg, auth.verificationId]);

  const onPressLogin = async () => {
    setLoading(true);
    if (state.countryCode) {
      if (state.contact) {
        if (isNaN(state.contact)) {
          setState({ ...state, entryType: "email" });
          const re =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (re.test(state.contact)) {
            pageActive.current = true;
            dispatch(requestEmailOtp(state.contact));
          } else {
            Alert.alert("Enter proper phone number")
            // Alert.alert(t("alert"), t("proper_email"));
            setLoading(false);
          }
        } else {
          setState({ ...state, entryType: "mobile" });
          let formattedNum = state.countryCode + state.contact;
          if (formattedNum.length > 6) {
            console.log("formattedNum", formattedNum);

            pageActive.current = true;
            dispatch(
              requestPhoneOtpDevice(formattedNum, recaptchaVerifier.current)
            );
          } else {
            Alert.alert(t("alert"), t("mobile_no_blank_error"));
            setLoading(false);
          }
        }
      } else {
        Alert.alert(t("alert"), t("contact_input_error"));
        setLoading(false);
      }
    } else {
      Alert.alert(t("alert"), t("country_blank_error"));
      setLoading(false);
    }
  };

  const onSignIn = async () => {
    console.log("VerificationCode", state.verificationCode);
    if (state.verificationCode) {
      setLoading(true);
      pageActive.current = true;
      if (state.entryType == "email") {
        dispatch(verifyEmailOtp(state.contact, state.verificationCode));
      } else {
        dispatch(mobileSignIn(state.verificationId, state.verificationCode));
      }
    } else {
      Alert.alert(t("alert"), t("otp_blank_error"));
      setLoading(false);
    }
  };

  const CancelLogin = () => {
    setState({
      ...state,
      contact: null,
      verificationId: null,
      verificationCode: null,
    });
  };

  const FbLogin = async () => {
    try {
      LoginManager.logInWithPermissions(["public_profile"]).then(
        function (result) {
          if (result.isCancelled) {
            console.log("Login cancelled");
          } else {
            AccessToken.getCurrentAccessToken().then((data) => {
              pageActive.current = true;
              dispatch(facebookSignIn(data.accessToken));
            });
          }
        },
        function (error) {
          Alert.alert(t("alert"), t("facebook_login_auth_error"));
        }
      );
    } catch (error) {
      console.log(error);
      Alert.alert(t("alert"), t("facebook_login_auth_error"));
    }
  };

  const AppleLogin = async () => {
    const csrf = Math.random().toString(36).substring(2, 15);
    const nonce = Math.random().toString(36).substring(2, 10);
    const hashedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      nonce
    );
    try {
      const applelogincredentials = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        state: csrf,
        nonce: hashedNonce,
      });

      pageActive.current = true;
      dispatch(
        appleSignIn({
          idToken: applelogincredentials.identityToken,
          rawNonce: nonce,
        })
      );
    } catch (error) {
      if (error.code === "ERR_CANCELED") {
        console.log(error);
      } else {
        Alert.alert(t("alert"), t("apple_signin_error"));
      }
    }
  };

  const openRegister = () => {
    pageActive.current = false;
    props.navigation.navigate("Register");
  };

  const openTerms = async () => {
    Linking.openURL(settings.CompanyTerms).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        accessible={false}
        style={styles.container}
      >
        <View style={commonStyles.PH30}>
          <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={config}
            androidHardwareAccelerationDisabled
            attemptInvisibleVerification={true}
          />
          {!!state.verificationId ? (
            <>
              {/* <View style={styles.box2}>
                        <TextInput
                            style={[styles.textInput, { textAlign: isRTL ? "right" : "left" }]}
                            placeholder={t('otp_here')}
                            onChangeText={(value) => setState({ ...state, verificationCode: value })}
                            value={state.verificationCode}
                            editable={!!state.verificationId}
                            keyboardType="phone-pad"
                            secureTextEntry={true}
                            placeholderTextColor={colors.MAP_TEXT}
                        />
                    </View>

<MaterialButtonDark
onPress={onSignIn}
style={styles.materialButtonDark}
>{t('verify_otp')}</MaterialButtonDark> */}

              <OtpScreen
                state={state}
                onVerify={() => onSignIn()}
                setState={setState}
                onResend={() => onPressLogin()}
              />
            </>
          ) : (
            <>
              <PhoneMainContainer state={state} setState={setState} />

              {/* <View style={styles.topBar}>
                </View> */}
              {/* <View style={[styles.headLanuage,[isRTL?{left:10}:{right: 10}]]}>
                <Text style={{ color: colors.BLACK, marginLeft: 3 }}>Lang:</Text>
                {langSelection && languagedata && languagedata.langlist ?
                    <RNPickerSelect
                        placeholder={{}}
                        value={langSelection}
                        useNativeAndroidPickerStyle={false}
                        
                        style={{
                            inputIOS: styles.pickerStyle1,
                            inputAndroid: styles.pickerStyle1,
                            placeholder: {
                                color: 'white'
                            },

                        }}
                        onValueChange={
                            (text) => {
                                let defl = null;
                                for (const value of Object.values(languagedata.langlist)) {
                                   if(value.langLocale == text){
                                      defl = value;
                                   }
                                }
                                setLangSelection(text);
                                i18n.locale = text;
                                moment.locale(defl.dateLocale);
                                setIsRTL(text == 'he' || text == 'ar')
                                AsyncStorage.setItem('lang', JSON.stringify({langLocale:text,dateLocale:defl.dateLocale }));
                            }
                        }
                        label={"Language"}
                        items={Object.values(languagedata.langlist).map(function (value) { return { label: value.langName, value: value.langLocale }; })}
                        Icon={() => { return <Ionicons style={{ marginTop: 3,}} name="md-arrow-down" size={20} color="gray" />; }}
                    />
                    : null}
                </View> */}

              {/* <View style={[styles.box1]}>
                <RNPickerSelect
                  placeholder={{
                    label: t("select_country"),
                    value: t("select_country"),
                  }}
                  value={state.countryCode}
                  useNativeAndroidPickerStyle={false}
                  style={{
                    inputIOS: [
                      styles.pickerStyle,
                      { textAlign: isRTL ? "right" : "left" },
                    ],
                    inputAndroid: [
                      styles.pickerStyle,
                      { textAlign: isRTL ? "right" : "left" },
                    ],
                  }}
                  onValueChange={(value) =>
                    setState({ ...state, countryCode: value })
                  }
                  items={state.countryCodeList}
                  disabled={
                    !!state.verificationId || !settings.AllowCountrySelection
                      ? true
                      : false
                  }
                />
              </View>
              
              <View style={styles.box2}>
                <TextInput
                  style={[
                    styles.textInput,
                    { textAlign: isRTL ? "right" : "left" },
                  ]}
                  placeholder={t("contact_placeholder")}
                  onChangeText={(value) =>
                    setState({ ...state, contact: value })
                  }
                  value={state.contact}
                  editable={!!state.verificationId ? false : true}
                  placeholderTextColor={colors.MAP_TEXT}
                />
              </View> */}

              {state.verificationId ? null : (
                <LoginBottom onLogin={onPressLogin} title="Sign In" />
              )}
            </>
          )}
          {state.verificationId ? null : (
            <Pressable
            onPress={() => {
              openRegister();
            }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CustomText
                label="Don’t have an account?"
                color={colors.lightBlack}
                fontFamily={"Roboto-Regular"}
                fontSize={12}
              />
              <CustomText
                label="Sign Up"
              
                color={colors.primary}
                marginLeft={2}
                fontFamily={"Roboto-Bold"}
                fontSize={12}
              />
            </Pressable>
          )}

          {/* {!!state.verificationId ?
                    <View style={styles.box2}>
                        <TextInput
                            style={[styles.textInput, { textAlign: isRTL ? "right" : "left" }]}
                            placeholder={t('otp_here')}
                            onChangeText={(value) => setState({ ...state, verificationCode: value })}
                            value={state.verificationCode}
                            editable={!!state.verificationId}
                            keyboardType="phone-pad"
                            secureTextEntry={true}
                            placeholderTextColor={colors.MAP_TEXT}
                        />
                    </View>
                    : null} */}
          {/* {!!state.verificationId ?
                    <MaterialButtonDark
                        onPress={onSignIn}
                        style={styles.materialButtonDark}
                    >{t('verify_otp')}</MaterialButtonDark>
                    : null}
                {state.verificationId ?
                    <View style={styles.actionLine}>
                        <TouchableOpacity style={styles.actionItem} onPress={CancelLogin}>
                            <Text style={styles.actionText}>{t('cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                    : null} */}
          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator color={colors.primary} size="large" />
            </View>
          ) : null}
          {/* {(Platform.OS == 'ios' && settings && settings.AppleLoginEnabled) || (settings && settings.FacebookLoginEnabled) ?
                <View style={styles.seperator}>
                    <View style={styles.lineLeft}></View>
                    <View style={styles.lineLeftFiller}>
                        <Text style={styles.sepText}>{t('spacer_message')}</Text>
                    </View>
                    <View style={styles.lineRight}></View>
                </View>
                : null}

            {(Platform.OS == 'ios' && settings && settings.AppleLoginEnabled) || (settings && settings.FacebookLoginEnabled) ?
                <View style={styles.socialBar}>
                    {settings && settings.FacebookLoginEnabled ?
                        <TouchableOpacity style={styles.socialIcon} onPress={FbLogin}>
                            <Image
                                source={require("../../assets/images/image_fb.png")}
                                resizeMode="contain"
                                style={styles.socialIconImage}
                            ></Image>
                        </TouchableOpacity>
                        : null}
                    {Platform.OS == 'ios' && settings.AppleLoginEnabled ?
                        <TouchableOpacity style={styles.socialIcon} onPress={AppleLogin}>
                            <Image
                                source={require("../../assets/images/image_apple.png")}
                                resizeMode="contain"
                                style={styles.socialIconImage}
                            ></Image>
                        </TouchableOpacity>
                        : null}
                </View>
                : null} */}
          {/* <View style={styles.footer}>
                <TouchableOpacity style={styles.terms} onPress={openRegister}>
                    <Text style={styles.actionText}>{t('register_as_driver')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.terms} onPress={openTerms}>
                    <Text style={styles.actionText}>{t('terms')}</Text>
                </TouchableOpacity>
            </View> */}
          {/* </ImageBackground> */}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
  container: {
    flex: 1,
  },
  imagebg: {
    position: "absolute",
    left: 0,
    top: 0,
    width: Dimensions.get("window").width,
    height:
      Dimensions.get("window").height +
      (Platform.OS == "android" && !__DEV__ ? 40 : 0),
  },
  topBar: {
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    height:
      Dimensions.get("window").height * 0.52 +
      (Platform.OS == "android" && !__DEV__ ? 40 : 0),
  },
  backButton: {
    height: 40,
    width: 40,
    marginTop: 30,
  },
  segmentcontrol: {
    color: colors.WHITE,
    fontSize: 18,
    fontFamily: "Roboto-Regular",
    marginTop: 0,
    alignSelf: "center",
    height: 50,
    marginLeft: 35,
    marginRight: 35,
  },
  box1: {
    height: 35,
    backgroundColor: colors.WHITE,
    marginTop: Platform.OS === "ios" ? 26 : 0,
    borderWidth: 1,
    borderColor: colors.BORDER_BACKGROUND,
    justifyContent: "center",
  },
  box2: {
    height: 35,
    backgroundColor: colors.WHITE,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.BORDER_BACKGROUND,
    justifyContent: "center",
  },
  textInput: {
    color: colors.BACKGROUND,
    fontSize: 18,
    fontFamily: "Roboto-Regular",
    //textAlign: "left",
    marginTop: 8,
    marginLeft: 5,
  },
  materialButtonDark: {
    height: 35,
    marginTop: 15,
    backgroundColor: colors.BUTTON,
  },
  linkBar: {
    flexDirection: "row",
    marginTop: 30,
    alignSelf: "center",
  },
  barLinks: {
    marginLeft: 15,
    marginRight: 15,
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.WHITE,
    fontFamily: "Roboto-Bold",
  },
  pickerStyle: {
    color: colors.BACKGROUND,
    fontFamily: "Roboto-Regular",
    fontSize: 18,
    marginLeft: 5,
  },

  actionLine: {
    height: 20,
    flexDirection: "row",
    marginTop: 15,
    alignSelf: "center",
  },
  actionItem: {
    height: 20,
    marginLeft: 15,
    marginRight: 15,
    alignSelf: "center",
  },
  actionText: {
    fontSize: 15,
    fontFamily: "Roboto-Regular",
    fontWeight: "bold",
  },
  actionLine: {
    height: 20,
    flexDirection: "row",
    marginTop: 20,
    alignSelf: "center",
  },
  actionItem: {
    height: 20,
    marginLeft: 15,
    marginRight: 15,
    alignSelf: "center",
  },
  actionText: {
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    fontWeight: "bold",
  },
  seperator: {
    width: 250,
    height: 20,
    flexDirection: "row",
    marginTop: 15,
    alignSelf: "center",
  },
  lineLeft: {
    width: 50,
    height: 1,
    backgroundColor: "rgba(113,113,113,1)",
    marginTop: 9,
  },
  sepText: {
    color: colors.BLACK,
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    opacity: 0.8,
  },
  lineLeftFiller: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  lineRight: {
    width: 50,
    height: 1,
    backgroundColor: "rgba(113,113,113,1)",
    marginTop: 9,
  },
  socialBar: {
    height: 40,
    flexDirection: "row",
    marginTop: 10,
    alignSelf: "center",
  },
  socialIcon: {
    width: 40,
    height: 40,
    marginLeft: 15,
    marginRight: 15,
    alignSelf: "center",
  },
  socialIconImage: {
    width: 40,
    height: 40,
  },
  footer: {
    marginTop: Platform.OS === "ios" ? 20 : 12,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  terms: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    opacity: 0.65,
  },
  pickerStyle1: {
    color: colors.BLACK,
    width: 68,
    fontSize: 15,
    height: 30,
    fontWeight: "bold",
  },
  headLanuage: {
    position: "absolute",
    top: Platform.OS == "android" && !__DEV__ ? 40 : 35,
    flexDirection: "row",
    borderWidth: 0.4,
    borderRadius: 20,
    alignItems: "center",
  },
});
