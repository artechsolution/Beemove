import React, { useEffect, useState, useContext, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Modal,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Switch,
  Image,
  Platform,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Button, Header } from "react-native-elements";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { colors } from "../common/theme";
import i18n from "i18n-js";
import { useDispatch, useSelector } from "react-redux";
import { FirebaseContext } from "common/src";
import { Alert } from "react-native";
import moment from "moment/min/moment-with-locales";
import carImageIcon from "../../assets/images/track_Car.png";
import { DrawerActions } from "@react-navigation/native";
import { useDrawerStatus } from "@react-navigation/drawer";
import CustomHeader from "../components/CustomHeader";
import { images } from "../../assets/images";
import commonStyles from "../../Utils/CommonStyles";
import CustomText from "../components/CustomText";
import ToggleSwitch from "toggle-switch-react-native";

import {
  AntDesign,
  Feather,
  Octicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Spacer } from "../components/Spacer";
import { scale, verticalScale } from "react-native-size-matters";

var { width, height } = Dimensions.get("window");

export default function DriverTrips(props) {
  const { api, appcat } = useContext(FirebaseContext);
  const { acceptTask, cancelTask, updateProfile, updateBooking } = api;
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.taskdata.tasks);
  const settings = useSelector((state) => state.settingsdata.settings);
  const auth = useSelector((state) => state.auth);
  const bookinglistdata = useSelector((state) => state.bookinglistdata);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeBookings, setActiveBookings] = useState([]);
  const [region, setRegion] = useState(null);
  const gps = useSelector((state) => state.gpsdata);
  const latitudeDelta = 0.0922;
  const longitudeDelta = 0.0421;
  const { t } = i18n;
  const isRTL =
    i18n.locale.indexOf("he") === 0 || i18n.locale.indexOf("ar") === 0;
  const isDrawerOpen = useDrawerStatus();
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (bookinglistdata.bookings) {
      setActiveBookings(
        bookinglistdata.bookings.filter(
          (booking) =>
            booking.status == "ACCEPTED" ||
            booking.status == "ARRIVED" ||
            booking.status == "STARTED" ||
            booking.status == "REACHED"
        )
      );
    }
  }, [bookinglistdata.bookings]);

  const onPressAccept = (item) => {
    let wallet_balance = parseFloat(auth.info.profile.walletBalance);
    if (!settings.negativeBalance && wallet_balance <= 0) {
      if (appcat == "delivery" && item.prepaid && item.payment_mode == "card") {
        console.log("jbjbjb");
        dispatch(acceptTask(auth.info, item));
        setSelectedItem(null);
        setModalVisible(null);
        setTimeout(() => {
          props.navigation.navigate("BookedCab", { bookingId: item.id });
        }, 3000);
      } else {
        Alert.alert(t("alert"), t("wallet_balance_zero"));
      }
    } else if (
      !settings.negativeBalance &&
      wallet_balance > 0 &&
      wallet_balance < item.convenience_fees &&
      !(appcat === "rentals")
    ) {
      if (appcat == "delivery" && item.prepaid && item.payment_mode == "card") {
        dispatch(acceptTask(auth.info, item));
        setSelectedItem(null);
        setModalVisible(null);
        setTimeout(() => {
          props.navigation.navigate("BookedCab", { bookingId: item.id });
        }, 3000);
      } else {
        Alert.alert(t("alert"), t("wallet_balance_low"));
      }
    } else if (appcat == "rentals") {
      if (parseFloat(amount) > 0) {
        const profile = auth.info.profile;
        let convenience_fees =
          item.commission_type == "flat"
            ? parseFloat(item.commission_rate)
            : (parseFloat(amount) * parseFloat(item.commission_rate)) / 100;
        let obj = {};
        obj.driver = auth.info.uid;
        obj.driver_image = profile.profile_image ? profile.profile_image : "";
        obj.driver_name = profile.firstName + " " + profile.lastName;
        obj.driver_contact = profile.mobile;
        obj.driver_token = profile.pushToken;
        obj.vehicle_number = profile.vehicleNumber;
        obj.driverRating = profile.ratings ? profile.ratings.userrating : "0";
        obj.fleetadmin = profile.fleetadmin ? profile.fleetadmin : "";
        obj.bidPrice = amount;
        obj.trip_cost = convenience_fees + parseFloat(amount);
        obj.convenience_fees = convenience_fees;
        obj.driver_share = parseFloat(amount);
        if (!item.driverOffers) {
          item.driverOffers = {};
        }
        item.driverOffers[auth.info.uid] = obj;
        setAmount(0);
        dispatch(updateBooking(item));
      } else {
        Alert.alert(t("alert"), t("no_details_error"));
      }
    } else {
      dispatch(acceptTask(auth.info, item));
      setSelectedItem(null);
      setModalVisible(null);
      setTimeout(() => {
        props.navigation.navigate("BookedCab", { bookingId: item.id });
      }, 3000);
    }
  };

  const onPressIgnore = (id) => {
    dispatch(cancelTask(id));
    setSelectedItem(null);
    setModalVisible(null);
  };

  const goToBooking = (id) => {
    props.navigation.navigate("BookedCab", { bookingId: id });
  };

  const onChangeFunction = () => {
    let res = !auth.info.profile.driverActiveStatus;
    dispatch(updateProfile(auth.info, { driverActiveStatus: res }));
  };

  useEffect(() => {
    if (gps.location) {
      if (gps.location.lat && gps.location.lng) {
        setRegion({
          latitude: gps.location.lat,
          longitude: gps.location.lng,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta,
        });
      }
    }
  }, [gps.location]);

  useEffect(() => {
    if (
      auth.info &&
      auth.info.profile &&
      !auth.info.profile.driverActiveStatus &&
      isDrawerOpen != "open"
    ) {
      Alert.alert(
        t("you_are_offline"),
        t("go_online_to_accepting_jobs"),
        [
          {
            text: t("no"),
            onPress: () => {},
            style: "cancel",
          },
          {
            text: t("yes"),
            onPress: () => {
              dispatch(updateProfile(auth.info, { driverActiveStatus: true }));
            },
          },
        ],
        { cancelable: false }
      );
    }
  }, []);

  const rCom = () => {
    return (
      <View
        style={{
          flexDirection: isRTL ? "row-reverse" : "row",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: colors.BLACK,
            fontWeight: "bold",
            marginRight: 10,
            // marginRight: Platform.OS == "ios" ? 10 : 10,
            // marginTop: 8,
          }}
        >
          {t("on_duty")}
        </Text>

        <Switch
          value={
            auth.info && auth.info.profile
              ? auth?.info?.profile?.driverActiveStatus
              : false
          }
          onValueChange={onChangeFunction}
          trackColor={{ false: "#767577", true: colors.primary }}
          thumbColor={
            auth?.info?.profile?.driverActiveStatus ? "#f4f3f4" : "#f4f3f4"
          }

          // style={{marginTop : Platform.OS == 'android'? -6 : 0}}
        />
      </View>
    );
  };
  const lCom = {
    icon: "md-menu",
    type: "ionicon",
    color: colors.BLACK,
    size: 30,
    component: TouchableWithoutFeedback,
    onPress: () => {
      props.navigation.dispatch(DrawerActions.toggleDrawer());
    },
  };

  return (
    <SafeAreaView style={styles.mainViewStyle}>
      <StatusBar hidden={false} />
      <Spacer height={Platform.OS == "android" ? 30 : 0} />

      <View style={{ paddingHorizontal: scale(15) }}>
        <Spacer height={Platform.OS == "android" ? 20 : 0} />

        <CustomHeader
          LeftSide={() => (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                props.navigation.dispatch(DrawerActions.toggleDrawer());
              }}
              style={commonStyles.iconContainer}
            >
              <Image
                resizeMode="contain"
                source={images.sort}
                style={commonStyles.img}
              />
            </TouchableOpacity>
          )}
          RightSide={isRTL ? lCom : rCom}
          Center={() => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: "20%",
              }}
            >
              <MaterialIcons name="work" color={colors.primary} size={20} />

              <Spacer width={10} />
              <CustomText
                label="Request"
                alignSelf={"center"}
                fontSize={16}
                fontFamily="Roboto-Medium"
                color={colors.lightText}
              />
            </View>
          )}
        />
      </View>
      <Spacer height={10} />

      {/* <Header
                backgroundColor={colors.HEADER}
                leftComponent={isRTL? rCom : lCom }
                rightComponent={isRTL? lCom : rCom } 
                centerComponent={<Text style={styles.headerTitleStyle}>{t('task_list')}</Text>}
                containerStyle={styles.headerStyle}
                innerContainerStyles={styles.headerInnerStyle}
            /> */}
      <FlatList
        data={
          auth.info && auth.info.profile && auth.info.profile.driverActiveStatus
            ? auth.info.profile.queue
              ? activeBookings
              : tasks
            : []
        }
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          auth.info &&
          auth.info.profile &&
          auth.info.profile.driverActiveStatus ? (
            <View style={{ height: height, width: width }}>
              {region ? (
                <MapView
                  region={{
                    latitude: region.latitude,
                    longitude: region.longitude,
                    latitudeDelta: latitudeDelta,
                    longitudeDelta: longitudeDelta,
                  }}
                  minZoomLevel={13}
                  provider={PROVIDER_GOOGLE}
                  style={{
                    height: height - (Platform.OS == "android" ? 15 : 60),
                    width: width,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: region.latitude,
                      longitude: region.longitude,
                    }}
                    pinColor={colors.HEADER}
                  >
                    <View style={{ alignItems: "center" }}>
                      <View
                        style={{
                          alignItems: "center",
                          backgroundColor: "white",
                          opacity: 0.8,
                          borderColor: "#000",
                          borderRadius: 10,
                          paddingVertical: 10,
                          paddingHorizontal: 5,
                          marginBottom: 5,
                          shadowColor:
                            Platform.OS == "ios" ? "#ced4da" : colors.BLACK,
                          shadowRadius: 5,
                          elevation: 5,
                          // alignItems: "center",
                          shadowOpacity: 0.6,

                          shadowOffset: { width: 30, height: 3 },
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            color: colors.primary,
                          }}
                        >
                          {t("where_are_you")}
                        </Text>
                        <Text
                          style={{
                            fontWeight: "bold",
                            color: colors.primary,
                          }}
                        >
                          {t("rider_not_here")}
                        </Text>
                      </View>
                      <Image
                        source={images.pointer}
                        style={{ height: 70, width: 70 }}
                      />
                    </View>
                  </Marker>
                </MapView>
              ) : gps.error ? (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    height: height,
                    width: width,
                  }}
                >
                  <Text>{t("location_permission_error")}</Text>
                </View>
              ) : (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    height: height,
                    width: width,
                  }}
                >
                  <Text>{t("loading")}</Text>
                </View>
              )}
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                height: height,
              }}
            >
              <View>
                <Image
                  source={
                    appcat == "taxi"
                      ? require("../../assets/images/no_riders.png")
                      : require("../../assets/images/no_agents.png")
                  }
                  resizeMode="contain"
                  style={{ height: 120, width: 200 }}
                ></Image>
              </View>
              <View>
                <Text style={styles.no_driver_style}>{t("service_off")}</Text>
              </View>
            </View>
          )
        }
        renderItem={({ item, index }) => {
          return (
            <View style={styles.listItemView}>
              <View
                style={[
                  styles.mapcontainer,
                  activeBookings && activeBookings.length >= 1
                    ? { height: height - 500 }
                    : null,
                ]}
              >
                <MapView
                  style={styles.map}
                  provider={PROVIDER_GOOGLE}
                  minZoomLevel={13}
                  initialRegion={{
                    latitude: item.pickup.lat,
                    longitude: item.pickup.lng,
                    latitudeDelta:
                      activeBookings && activeBookings.length >= 1
                        ? 0.0922
                        : 0.0822,
                    longitudeDelta:
                      activeBookings && activeBookings.length >= 1
                        ? 0.0421
                        : 0.0321,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: item.pickup.lat,
                      longitude: item.pickup.lng,
                    }}
                    title={item.pickup.add}
                    description={t("pickup_location")}
                    pinColor={colors.GREEN_DOT}
                  />

                  <Marker
                    coordinate={{
                      latitude: item.drop.lat,
                      longitude: item.drop.lng,
                    }}
                    title={item.drop.add}
                    description={t("drop_location")}
                  />
                  {item.waypoints && item.waypoints.length > 0
                    ? item.waypoints.map((point, index) => {
                        return (
                          <Marker
                            coordinate={{
                              latitude: point.lat,
                              longitude: point.lng,
                            }}
                            pinColor={colors.RED}
                            title={point.add}
                            key={index}
                          ></Marker>
                        );
                      })
                    : null}
                  {item.coords ? (
                    <MapView.Polyline
                      coordinates={item.coords}
                      strokeWidth={4}
                      strokeColor={colors.INDICATOR_BLUE}
                      lineDashPattern={[1]}
                    />
                  ) : null}
                </MapView>
              </View>

              <View style={styles.mapDetails}>
                <View style={styles.dateView}>
                  <Text style={styles.listDate}>
                    {moment(item.tripdate).format("lll")}
                  </Text>
                </View>
                {appcat === "taxi" || appcat === "delivery" ? (
                  <View style={styles.rateViewStyle}>
                    {settings.swipe_symbol === false ? (
                      <Text style={styles.rateViewTextStyle}>
                        {settings.symbol}
                        {item
                          ? item.estimate > 0
                            ? parseFloat(item.estimate).toFixed(
                                settings.decimal
                              )
                            : 0
                          : null}
                      </Text>
                    ) : (
                      <Text style={styles.rateViewTextStyle}>
                        {item
                          ? item.estimate > 0
                            ? parseFloat(item.estimate).toFixed(
                                settings.decimal
                              )
                            : 0
                          : null}
                        {settings.symbol}
                      </Text>
                    )}
                  </View>
                ) : null}
                {appcat == "rentals" &&
                item.driverOffers &&
                item.driverOffers[auth.info.uid] ? (
                  <View style={styles.rateViewStyle}>
                    {settings.swipe_symbol === false ? (
                      <Text style={styles.rateViewTextStyle}>
                        {settings.symbol}
                        {item.driverOffers[auth.info.uid].driver_share}
                      </Text>
                    ) : (
                      <Text style={styles.rateViewTextStyle}>
                        {item.driverOffers[auth.info.uid].driver_share}
                        {settings.symbol}
                      </Text>
                    )}
                  </View>
                ) : null}
                <View
                  style={[
                    styles.estimateView,
                    { flexDirection: isRTL ? "row-reverse" : "row" },
                  ]}
                >
                  <Text style={styles.listEstimate}>
                    {item.estimateDistance
                      ? parseFloat(item.estimateDistance).toFixed(
                          settings.decimal
                        )
                      : 0}{" "}
                    {settings.convert_to_mile ? t("mile") : t("km")}
                  </Text>
                  <Text style={styles.listEstimate}>
                    {item.estimateTime
                      ? parseFloat(item.estimateTime / 60).toFixed(0)
                      : 0}{" "}
                    {t("mins")}
                  </Text>
                </View>
                <View
                  style={[
                    styles.addressViewStyle,
                    isRTL ? { paddingRight: 10 } : { paddingLeft: 10 },
                  ]}
                >
                  {console.log(item)}
                  <View><Text>{item?.additional?.pickup}</Text></View>
                  <View
                    style={{
                      flexDirection: isRTL ? "row-reverse" : "row",
                      alignItems: "center",
                    }}
                  >
                    {/* <Blur */}
                    {/* <BlurCircle /> */}
                    <View
                      style={{
                        borderRadius: 30,
                        borderWidth: 2,
                        borderColor: colors.SKY,
                        padding: 2,
                      }}
                    >
                      <View
                        style={{
                          borderRadius: 99,
                          backgroundColor: colors.SKY,
                          width: 10,
                          height: 10,
                        }}
                      ></View>
                    </View>

                    {/* <View style={styles.greenDot}></View> */}
                    <Text
                      style={[
                        styles.addressViewTextStyle,
                        isRTL ? { marginRight: 10 } : { marginLeft: 10 },
                        { textAlign: isRTL ? "right" : "left" },
                      ]}
                    >
                      {item.pickup.add}
                    </Text>
                  </View>
                  {item.waypoints && item.waypoints.length > 0
                    ? item.waypoints.map((point, index) => {
                        return (
                          <View
                            key={"key" + index}
                            style={{
                              flexDirection: isRTL ? "row-reverse" : "row",
                              alignItems: "center",
                            }}
                          >
                            <Image
                              source={require("../../assets/images/location.png")}
                              style={{ height: 20, width: 20 }}
                              resizeMode={"contain"}
                            />
                            {/* <View style={styles.redDot}></View> */}
                            <Text
                              style={[
                                styles.addressViewTextStyle,
                                isRTL
                                  ? { marginRight: 10 }
                                  : { marginLeft: 10 },
                                { textAlign: isRTL ? "right" : "left" },
                              ]}
                            >
                              {point.add}
                            </Text>
                          </View>
                        );
                      })
                    : null}
                  <View
                    style={{
                      flexDirection: isRTL ? "row-reverse" : "row",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={require("../../assets/images/location.png")}
                      style={{ height: 20, width: 20 }}
                      resizeMode={"contain"}
                    />
                    {/* <View style={styles.redDot}></View> */}
                    <Text
                      style={[
                        styles.addressViewTextStyle,
                        isRTL ? { marginRight: 10 } : { marginLeft: 10 },
                        { textAlign: isRTL ? "right" : "left" },
                      ]}
                    >
                      {item.drop.add}
                    </Text>
                  </View>
                </View>
                {appcat == "delivery" ? (
                  <View
                    style={[
                      styles.textContainerStyle,
                      { flexDirection: isRTL ? "row-reverse" : "row" },
                    ]}
                  >
                    <Text style={styles.textHeading}>
                      {t("parcel_type")} -{" "}
                    </Text>
                    <Text style={styles.textContent}>
                      {item && item.parcelTypeSelected
                        ? item.parcelTypeSelected.description
                        : ""}
                    </Text>
                  </View>
                ) : null}
                {appcat == "delivery" ? (
                  <View
                    style={[
                      styles.textContainerStyle,
                      { flexDirection: isRTL ? "row-reverse" : "row" },
                    ]}
                  >
                    <Text style={styles.textHeading}>{t("options")} - </Text>
                    <Text style={styles.textContent}>
                      {item && item.optionSelected
                        ? item.optionSelected.description
                        : ""}
                    </Text>
                  </View>
                ) : null}
                {appcat == "delivery" ? (
                  <View
                    style={[
                      styles.textContainerStyle,
                      { flexDirection: isRTL ? "row-reverse" : "row" },
                    ]}
                  >
                    <Text style={styles.textHeading}>
                      {t("pickUpInstructions")} -{" "}
                    </Text>
                    <Text style={styles.textContent}>
                      {item ? item.pickUpInstructions : ""}
                    </Text>
                  </View>
                ) : null}
                {appcat == "delivery" ? (
                  <View
                    style={[
                      styles.textContainerStyle,
                      { flexDirection: isRTL ? "row-reverse" : "row" },
                    ]}
                  >
                    <Text style={styles.textHeading}>
                      {t("deliveryInstructions")} -{" "}
                    </Text>
                    <Text style={styles.textContent}>
                      {item ? item.deliveryInstructions : ""}
                    </Text>
                  </View>
                ) : null}
                {appcat == "delivery" ? (
                  <View
                    style={[
                      styles.textContainerStyle,
                      { flexDirection: isRTL ? "row-reverse" : "row" },
                    ]}
                  >
                    <Text style={styles.textHeading}>
                      {t("payment_mode")} -{" "}
                    </Text>
                    <Text style={styles.textContent}>
                      {item.booking_type_admin ? "Cash" : item.payment_mode}
                    </Text>
                  </View>
                ) : null}
                {appcat == "rentals" ? (
                  <View
                    style={[
                      styles.textContainerStyle,
                      { flexDirection: isRTL ? "row-reverse" : "row" },
                    ]}
                  >
                    <Text style={styles.textHeading}>
                      {t("tripInstructions")} -{" "}
                    </Text>
                    <Text style={styles.textContent}>
                      {item ? item.tripInstructions : ""}
                    </Text>
                  </View>
                ) : null}
                {appcat == "rentals" ? (
                  <View
                    style={[
                      styles.textContainerStyle,
                      {
                        paddingBottom: 15,
                        flexDirection: isRTL ? "row-reverse" : "row",
                      },
                    ]}
                  >
                    <Text style={styles.textHeading}>{t("roundTrip")} - </Text>
                    <Text style={styles.textContent}>
                      {item.roundTrip ? t("yes") : t("no")}
                    </Text>
                  </View>
                ) : null}
                {appcat == "rentals" &&
                item.status == "NEW" &&
                !(item.driverOffers && item.driverOffers[auth.info.uid]) ? (
                  <View style={styles.box}>
                    <TextInput
                      style={[
                        styles.dateTextStyle,
                        { textAlign: isRTL ? "right" : "left" },
                      ]}
                      placeholder={t("amount")}
                      onChangeText={(value) => setAmount(value)}
                      value={
                        amount && !isNaN(amount) ? amount.toString() : null
                      }
                      keyboardType="number-pad"
                    />
                  </View>
                ) : null}
                {activeBookings && activeBookings.length >= 1 ? (
                  <View style={styles.detailsBtnView}>
                    <View style={{ flex: 1 }}>
                      <Button
                        onPress={() => {
                          goToBooking(item.id);
                        }}
                        title={t("go_to_booking")}
                        titleStyle={styles.titleStyles}
                        buttonStyle={{
                          backgroundColor: colors.primary,
                          width: 180,
                          height: 50,
                          padding: 2,
                          borderColor: colors.TRANSPARENT,
                          borderWidth: 0,
                          borderRadius: 5,
                        }}
                        containerStyle={{
                          flex: 1,
                          alignSelf: "center",
                          paddingRight: 14,
                        }}
                      />
                    </View>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.detailsBtnView,
                      { flexDirection: isRTL ? "row-reverse" : "row" },
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Button
                        onPress={() => {
                          setModalVisible(true);
                          setSelectedItem(item);
                        }}
                        title={t("ignore_text")}
                        titleStyle={styles.titleStyles}
                        buttonStyle={styles.myButtonStyle}
                        containerStyle={{
                          flex: 1,
                          alignSelf: isRTL ? "flex-start" : "flex-end",
                          paddingRight: isRTL ? 0 : 14,
                          paddingLeft: isRTL ? 14 : 0,
                        }}
                      />
                    </View>
                    {!(appcat === "rentals") ||
                    (appcat == "rentals" &&
                      !(
                        item.driverOffers && item.driverOffers[auth.info.uid]
                      )) ? (
                      <View style={styles.viewFlex1}>
                        <Button
                          title={t("accept")}
                          titleStyle={{
                            ...styles.titleStyles,
                            color: colors.primary,
                          }}
                          onPress={() => {
                            onPressAccept(item);
                          }}
                          buttonStyle={{
                            backgroundColor: colors.WHITE,
                            width: height / 6,
                            height: verticalScale(35),
                            padding: 2,
                            borderColor: colors.TRANSPARENT,
                            borderWidth: 1.5,
                            borderRadius: 10,
                            borderColor: colors.PROFILE_PLACEHOLDER_TEXT,
                          }}
                          containerStyle={{
                            flex: 1,
                            alignSelf: isRTL ? "flex-end" : "flex-start",
                            paddingRight: isRTL ? 14 : 0,
                            paddingLeft: isRTL ? 0 : 14,
                          }}
                        />
                      </View>
                    ) : null}
                  </View>
                )}
              </View>
            </View>
          );
        }}
      />

      <View style={styles.modalPage}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert(t("modal_close"));
          }}
        >
          <View style={styles.modalMain}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeading}>
                <Text style={styles.alertStyle}>{t("alert_text")}</Text>
              </View>
              <View style={styles.modalBody}>
                <Text style={{ fontSize: 16 }}>{t("ignore_job_title")}</Text>
              </View>
              <View
                style={[
                  styles.modalFooter,
                  { flexDirection: isRTL ? "row-reverse" : "row" },
                ]}
              >
                <TouchableHighlight
                  style={
                    isRTL
                      ? [styles.btnStyle]
                      : [styles.btnStyle, styles.clickText]
                  }
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    setSelectedItem(null);
                  }}
                >
                  <Text style={styles.cancelTextStyle}>{t("cancel")}</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={
                    isRTL
                      ? [styles.btnStyle, styles.clickText]
                      : [styles.btnStyle]
                  }
                  onPress={() => {
                    onPressIgnore(selectedItem.id);
                  }}
                >
                  <Text style={styles.okStyle}>{t("ok")}</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

//Screen Styling
const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: colors.HEADER,
    borderBottomWidth: 0,
  },
  headerInnerStyle: {
    marginLeft: 10,
    marginRight: 10,
  },
  headerTitleStyle: {
    color: colors.WHITE,
    fontFamily: "Roboto-Bold",
    fontSize: 20,
    marginTop: 3,
  },
  mapcontainer: {
    flex: 1.5,
    width: width,
    height: 200,
    borderWidth: 7,
    borderColor: colors.WHITE,
    justifyContent: "center",
    alignItems: "center",
  },
  mapDetails: {
    backgroundColor: colors.WHITE,
    flex: 1,
    flexDirection: "column",
    margin: 15,
    padding: 10,
    // position: "absolute",
    borderRadius: 20,
    shadowOffset: { width: -2, height: -2 },
    shadowColor: Platform.OS == "ios" ? "#6c757d" : colors.BLACK,
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  map: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: colors.TRANSPARENT,
    borderStyle: "solid",
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderBottomWidth: 10,
    borderLeftColor: colors.TRANSPARENT,
    borderRightColor: colors.TRANSPARENT,
    borderBottomColor: colors.BOX_BG,
    transform: [{ rotate: "180deg" }],
  },
  signInTextStyle: {
    fontFamily: "Roboto-Bold",
    fontWeight: "700",
    color: colors.WHITE,
  },
  listItemView: {
    flex: 1,
    width: "100%",
    // height: 350,
    marginBottom: 10,
    flexDirection: "column",
  },
  dateView: {
    flex: 1.1,
  },
  listDate: {
    fontSize: 15,
    // fontWeight: "bold",
    fontFamily: "Roboto-Bold",
    paddingLeft: 10,
    color: colors.BLACK,
    flex: 1,
    alignSelf: "center",
  },
  estimateView: {
    flex: 1.1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  listEstimate: {
    fontSize: 20,
    color: colors.DRIVER_TRIPS_TEXT,
  },
  addressViewStyle: {
    flex: 2,
  },
  no_driver_style: {
    color: colors.DRIVER_TRIPS_TEXT,
    fontSize: 18,
  },
  addressViewTextStyle: {
    color: colors.DRIVER_TRIPS_TEXT,
    fontSize: 15,
    //marginLeft: 15,
    lineHeight: 24,
    flexWrap: "wrap",
  },
  greenDot: {
    backgroundColor: colors.GREEN_DOT,
    width: 10,
    height: 10,
    borderRadius: 50,
  },
  redDot: {
    backgroundColor: colors.RED,
    width: 10,
    height: 10,
    borderRadius: 50,
  },
  detailsBtnView: {
    flex: 1,
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
  },

  modalPage: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  modalMain: {
    flex: 1,
    backgroundColor: colors.BACKGROUND,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: colors.WHITE,
    borderRadius: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 15,
    flex: 1,
    maxHeight: 180,
  },
  modalHeading: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  modalFooter: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    borderTopColor: colors.FOOTERTOP,
    borderTopWidth: 1,
    width: "100%",
  },
  btnStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainViewStyle: {
    flex: 1,
    paddingTop: Platform.OS == "ios" ? 40 : 10,

    //marginTop: StatusBar.currentHeight
  },
  myButtonStyle: {
    width: height / 6,
    padding: 2,
    backgroundColor: colors.primary,
    height: verticalScale(35),
    borderRadius: 10,
    borderColor: colors.PROFILE_PLACEHOLDER_TEXT,
  },
  alertStyle: {
    fontWeight: "bold",
    fontSize: 18,
    width: "100%",
    textAlign: "center",
  },
  cancelTextStyle: {
    color: colors.INDICATOR_BLUE,
    fontSize: 18,
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
  },
  okStyle: {
    color: colors.INDICATOR_BLUE,
    fontSize: 18,
    fontWeight: "bold",
  },
  viewFlex1: {
    flex: 1,
  },
  clickText: {
    borderRightColor: colors.DRIVER_TRIPS_TEXT,
    borderRightWidth: 1,
  },
  titleStyles: {
    width: "100%",
    alignSelf: "center",
  },
  rateViewStyle: {
    alignItems: "center",
    flex: 2,
    marginTop: 10,
    marginBottom: 10,
  },
  rateViewTextStyle: {
    fontSize: 30,
    color: colors.BLACK,
    fontFamily: "Roboto-Bold",
    // fontWeight: "bold",
    textAlign: "center",
  },
  textContainerStyle: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginLeft: 35,
    marginRight: 35,
    marginTop: 10,
  },
  textContainerStyle2: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginLeft: 35,
    marginRight: 35,
    marginTop: 10,
  },
  textHeading: {
    fontWeight: "bold",
    color: colors.DRIVER_TRIPS_TEXT,
    fontSize: 15,
  },
  textContent: {
    color: colors.DRIVER_TRIPS_TEXT,
    fontSize: 15,
    marginLeft: 3,
  },
  textContent2: {
    marginTop: 4,
    color: colors.DRIVER_TRIPS_TEXT,
    fontSize: 15,
  },
  box: {
    height: 45,
    backgroundColor: colors.WHITE,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    borderWidth: 1,
    borderColor: colors.BLACK,
    justifyContent: "center",
    borderRadius: 10,
  },
  labelStyle: {
    fontFamily: "Roboto",
    fontSize: 13,
    color: colors.BLACK,
    marginTop: 15,
    alignSelf: "center",
  },
  dateTextStyle: {
    marginLeft: 14,
    fontFamily: "Roboto-Bold",
    fontSize: 14,
    fontWeight: "400",
    color: colors.BLACK,
  },
});
