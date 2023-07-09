import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
} from "react-native";
import React, { useContext } from "react";
import LoginRegHeader from "./Molecules/LoginRegHeader";
import LoginRegBottom from "./Molecules/LoginRegBottom";
import { Spacer } from "../../../components/Spacer";
import PercentageSpacer from "../../../components/PercentageSpacer";
import commonStyles from "../../../../Utils/CommonStyles";
import { FirebaseContext } from "common/src";
import { AccessToken, LoginManager } from "react-native-fbsdk-next";
import * as Crypto from "expo-crypto";
import i18n from "i18n-js";

const LoginRegister = ({ navigation }) => {
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
  const { t } = i18n;

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
  return (
    <SafeAreaView style={commonStyles.container}>
      <Spacer height={10} />
      <LoginRegHeader />
      <View style={commonStyles.PH30}>
        <PercentageSpacer height={"35%"} />
        <LoginRegBottom
          onGoogle={() => {
            FbLogin();
          }}
          onFaceBook={() => {
            FbLogin();
          }}
          onLogin={() => {
            navigation.navigate("Login");
          }}
          onRegister={() => {
            navigation.navigate("Register");
          }}
        />
      </View>
    </SafeAreaView>
  );
};
export default LoginRegister;

const styles = StyleSheet.create({});
