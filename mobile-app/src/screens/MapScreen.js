import React, { useEffect, useState, useRef, useContext } from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Text,
  Platform,
  Alert,
  ScrollView,
  StatusBar,
  // Animated,
  useColorScheme,
  PanResponder,
  Animated,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon, Tooltip, Button } from "react-native-elements";
import { colors } from "../common/theme";
import * as Location from "expo-location";
var { height, width } = Dimensions.get("window");
import i18n from "i18n-js";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSelector, useDispatch } from "react-redux";
import { FirebaseContext } from "common/src";
import { OptionModal } from "../components/OptionModal";
import BookingModal from "../components/BookingModal";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { DrawerActions, useIsFocused } from "@react-navigation/native";
import PadalaScreen from "./Main/Padala/PadalaScreen";
import Home from "./Main/Home/Home";
import { Spacer } from "../components/Spacer";
import MainTopHeader from "../components/MainTopHeader";
import TopRideContainer from "../components/TopRideContainer";
import CustomButton from "../components/CustomButton";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { AntDesign } from "@expo/vector-icons";
import { images } from "../../assets/images";
import RideBottomContainer from "./Main/Ride/Molecules/RideBottomContainer";
import CustomTextInput from "../components/CustomTextInput";
import commonStyles from "../../Utils/CommonStyles";
import CustomText from "../components/CustomText";
import { Ionicons, Feather } from "@expo/vector-icons";
import AddlButton from "../components/AddlButton";
import Collapsible from "react-native-collapsible";
import GroceryListItem from "../components/GroceryListItem";
import {
  AvatarHeaderScrollView,
  DetailsHeaderScrollView,
} from "react-native-sticky-parallax-header";
import { SafeAreaProvider } from "react-native-safe-area-context";
import StickyParallaxHeader from "react-native-sticky-parallax-header";
// import { Brandon } from "./Main/UserData";
import ReactNativeParallaxHeader from "react-native-parallax-header";
import CustomHeader from "../components/CustomHeader";
import Modal from "react-native-modal";
import { SwipeablePanel } from "rn-swipeable-panel";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Swipup from "../components/Swipup";
import DraggableSheet from "../components/DraggableSheet";

const hasNotch =
  Platform.OS === "ios" &&
  !Platform.isPad &&
  !Platform.isTVOS &&
  (height === 780 ||
    width === 780 ||
    height === 812 ||
    width === 812 ||
    height === 844 ||
    width === 844 ||
    height === 896 ||
    width === 896 ||
    height === 926 ||
    width === 926);

export default function MapScreen(props) {
  const { api, appcat } = useContext(FirebaseContext);
  const {
    fetchAddressfromCoords,
    fetchDrivers,
    updateTripPickup,
    updateTripDrop,
    updatSelPointType,
    getDistanceMatrix,
    MinutesPassed,
    updateTripCar,
    getEstimate,
    getDirectionsApi,
    clearEstimate,
    addBooking,
    clearBooking,
    clearTripPoints,
    GetDistance,
    readProfile,
  } = api;
  const dispatch = useDispatch();
  const { t } = i18n;
  const isRTL =
    i18n.locale.indexOf("he") === 0 || i18n.locale.indexOf("ar") === 0;

  const auth = useSelector((state) => state.auth);
  const settings = useSelector((state) => state.settingsdata.settings);
  const cars = useSelector((state) => state.cartypes.cars);
  const tripdata = useSelector((state) => state.tripdata);
  const usersdata = useSelector((state) => state.usersdata);
  const estimatedata = useSelector((state) => state.estimatedata);
  const activeBookings = useSelector((state) => state.bookinglistdata.active);
  const gps = useSelector((state) => state.gpsdata);

  const latitudeDelta = 0.0922;
  const longitudeDelta = 0.0421;

  const [allCarTypes, setAllCarTypes] = useState([]);
  const [freeCars, setFreeCars] = useState([]);
  const [pickerConfig, setPickerConfig] = useState({
    selectedDateTime: new Date(),
    dateModalOpen: false,
    dateMode: "date",
  });
  const [region, setRegion] = useState(null);
  const [optionModalStatus, setOptionModalStatus] = useState(false);
  const [bookingDate, setBookingDate] = useState(null);
  const [bookingModalStatus, setBookingModalStatus] = useState(false);
  const [bookLoading, setBookLoading] = useState(false);
  const [bookLaterLoading, setBookLaterLoading] = useState(false);

  const instructionInitData = {
    deliveryPerson: "",
    deliveryPersonPhone: "",
    pickUpInstructions: "",
    deliveryInstructions: "",
    parcelTypeIndex: 0,
    optionIndex: 0,
    parcelTypeSelected: null,
    optionSelected: null,
  };
  const [instructionData, setInstructionData] = useState(instructionInitData);
  const bookingdata = useSelector((state) => state.bookingdata);
  const [locationRejected, setLocationRejected] = useState(false);
  const mapRef = useRef();
  const [dragging, setDragging] = useState(0);

  const animation = useRef(new Animated.Value(4)).current;
  const [isEditing, setIsEditing] = useState(false);
  const [touchY, setTouchY] = useState();

  const [bookingType, setBookingType] = useState(false);
  const intVal = useRef();

  const [profile, setProfile] = useState();
  const [checkType, setCheckType] = useState(false);
  const pageActive = useRef();
  const [drivers, setDrivers] = useState();
  const [roundTrip, setRoundTrip] = useState(false);
  const isFocused = useIsFocused();
  const [tripInstructions, setTripInstructions] = useState("");
  const [next, setNext] = useState(false);
  const screenName = props?.route?.params?.name;
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    if (usersdata.users) {
      setDrivers(usersdata.users);
    }
  }, [usersdata.users]);

  useEffect(() => {
    if (auth.info && auth.info.profile) {
      setProfile(auth.info.profile);
    } else {
      setProfile(null);
    }
  }, [auth.info]);

  useEffect(() => {
    if (tripdata.drop && tripdata.drop.add) {
      setIsEditing(true);
    }
  }, [tripdata]);

  useEffect(
    () => (easing) => {
      Animated.timing(animation, {
        toValue: !isEditing ? 4 : 0,
        duration: 300,
        useNativeDriver: false,
        easing,
      }).start();
    },
    [isEditing]
  );

  useEffect(() => {
    if (cars) {
      resetCars();
    }
  }, [cars]);

  useEffect(() => {
    if (tripdata.pickup && drivers) {
      getDrivers();
    }
    if (tripdata.pickup && !drivers) {
      resetCars();
      setFreeCars([]);
    }
  }, [drivers, tripdata.pickup]);

  useEffect(() => {
    if (estimatedata.estimate) {
      setBookingModalStatus(true);
      setBookLoading(false);
      setBookLaterLoading(false);
    }
    if (estimatedata.error && estimatedata.error.flag) {
      setBookLoading(false);
      setBookLaterLoading(false);
      Alert.alert(estimatedata.error.msg);
      dispatch(clearEstimate());
    }
  }, [estimatedata.estimate, estimatedata.error, estimatedata.error.flag]);

  useEffect(() => {
    if (
      tripdata.selected &&
      tripdata.selected == "pickup" &&
      tripdata.pickup &&
      tripdata.pickup.source == "search"
    ) {
      if (!locationRejected) {
        setTimeout(() => {
          mapRef.current.animateToRegion({
            latitude: tripdata.pickup.lat,
            longitude: tripdata.pickup.lng,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
          });
        }, 1000);
      } else {
        setRegion({
          latitude: tripdata.pickup.lat,
          longitude: tripdata.pickup.lng,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta,
        });
      }
    }
    if (
      tripdata.selected &&
      tripdata.selected == "drop" &&
      tripdata.drop &&
      tripdata.drop.source == "search"
    ) {
      if (!locationRejected) {
        setTimeout(() => {
          mapRef.current.animateToRegion({
            latitude: tripdata.drop.lat,
            longitude: tripdata.drop.lng,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
          });
        }, 1000);
      } else {
        setRegion({
          latitude: tripdata.drop.lat,
          longitude: tripdata.drop.lng,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta,
        });
      }
    }
  }, [tripdata.selected, tripdata.pickup, tripdata.drop]);

  useEffect(() => {
    if (bookingdata.booking) {
      const bookingStatus = bookingdata.booking.mainData.status;
      if (bookingStatus == "PAYMENT_PENDING") {
        setTimeout(() => {
          props.navigation.navigate("PaymentDetails", {
            booking: bookingdata.booking.mainData,
          });
        }, 1000);
      } else {
        setTimeout(() => {
          props.navigation.navigate("BookedCab", {
            bookingId: bookingdata.booking.booking_id,
          });
        }, 1000);
      }
      dispatch(clearEstimate());
      dispatch(clearBooking());
    }
    if (bookingdata.error && bookingdata.error.flag) {
      Alert.alert(bookingdata.error.msg);
      dispatch(clearBooking());
    }
  }, [bookingdata.booking, bookingdata.error, bookingdata.error.flag]);

  useEffect(() => {
    if (gps.location) {
      if (gps.location.lat && gps.location.lng) {
        setDragging(0);
        if (region) {
          mapRef.current.animateToRegion({
            latitude: gps.location.lat,
            longitude: gps.location.lng,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
          });
        } else {
          setRegion({
            latitude: gps.location.lat,
            longitude: gps.location.lng,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
          });
        }
        updateAddresses(
          {
            latitude: gps.location.lat,
            longitude: gps.location.lng,
          },
          region ? "gps" : "init"
        );
      } else {
        setLocationRejected(true);
      }
    }
  }, [gps.location]);

  useEffect(() => {
    if (region && mapRef.current) {
      if (Platform.OS == "ios") {
        mapRef.current.animateToRegion({
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta,
        });
      }
    }
  }, [region, mapRef.current]);

  const resetCars = () => {
    let carWiseArr = [];
    for (let i = 0; i < cars.length; i++) {
      let temp = { ...cars[i], minTime: "", available: false, active: false };
      carWiseArr.push(temp);
    }
    setAllCarTypes(carWiseArr);
  };

  const resetActiveCar = () => {
    let carWiseArr = [];
    for (let i = 0; i < allCarTypes.length; i++) {
      let temp = { ...allCarTypes[i], active: false };
      carWiseArr.push(temp);
    }
    setAllCarTypes(carWiseArr);
  };

  const locateUser = async () => {
    if (tripdata.selected == "pickup") {
      let tempWatcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
        },
        (location) => {
          dispatch({
            type: "UPDATE_GPS_LOCATION",
            payload: {
              lat: location.coords.latitude,
              lng: location.coords.longitude,
            },
          });
          tempWatcher.remove();
        }
      );
    }
  };

  const updateAddresses = async (pos, source) => {
    let latlng = pos.latitude + "," + pos.longitude;
    if (!pos.latitude) return;
    fetchAddressfromCoords(latlng).then((res) => {
      if (res) {
        if (tripdata.selected == "pickup") {
          dispatch(
            updateTripPickup({
              lat: pos.latitude,
              lng: pos.longitude,
              add: res,
              source: source,
            })
            );
            // console.log("RESRESRESRESRESRESRES",res)
          if (source == "init") {
            dispatch(
              updateTripDrop({
                lat: pos.latitude,
                lng: pos.longitude,
                add: null,
                source: source,
              })
            );
          }
        } else {
          dispatch(
            updateTripDrop({
              lat: pos.latitude,
              lng: pos.longitude,
              add: res,
              source: source,
            })
          );
        }
      }
    });
  };

  const onRegionChangeComplete = async (newregion, gesture) => {
    const { latitude, longitude } = newregion;
    let response = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    // for (let item of response) {
    //   let address = `${item.district}, ${item.city}, ${item.region}, ${item.country}`;

    //   console.log(address, "<== address");
    //   // console.log(response, "<== response");
    //   // setText(address);
    // }
    // console.log(coords, "<== coords");
      console.log(response, "<== response");

    if (gesture && gesture.isGesture) {
      updateAddresses(
        {
          latitude: newregion.latitude,
          longitude: newregion.longitude,
        },
        "region-change",
        // console.log("newregion========>>>>>>>>>",newregion)
      );
      
    }
    
  };

  const selectCarType = (value, key) => {
    let carTypes = allCarTypes;
    for (let i = 0; i < carTypes.length; i++) {
      carTypes[i].active = false;
      if (carTypes[i].name == value.name) {
        carTypes[i].active = true;
        let instObj = { ...instructionData };
        if (Array.isArray(carTypes[i].parcelTypes)) {
          instObj.parcelTypeSelected = carTypes[i].parcelTypes[0];
          instObj.parcelTypeIndex = 0;
        }
        if (Array.isArray(carTypes[i].options)) {
          instObj.optionSelected = carTypes[i].options[0];
          instObj.optionIndex = 0;
        }
        setInstructionData(instObj);
      } else {
        carTypes[i].active = false;
      }
    }
    dispatch(updateTripCar(value));
  };

  const getDrivers = async () => {
    if (tripdata.pickup) {
      let availableDrivers = [];
      let arr = {};
      let startLoc = tripdata.pickup.lat + "," + tripdata.pickup.lng;

      let distArr = [];
      let allDrivers = [];
      for (let i = 0; i < drivers.length; i++) {
        let driver = { ...drivers[i] };
        let distance = GetDistance(
          tripdata.pickup.lat,
          tripdata.pickup.lng,
          driver.location.lat,
          driver.location.lng
        );
        if (settings.convert_to_mile) {
          distance = distance / 1.609344;
        }
        if (
          distance <
          (settings && settings.driverRadius ? settings.driverRadius : 10)
        ) {
          driver["distance"] = distance;
          allDrivers.push(driver);
        }
      }

      const sortedDrivers = settings.useDistanceMatrix
        ? allDrivers.slice(0, 25)
        : allDrivers;

      if (sortedDrivers.length > 0) {
        let driverDest = "";
        for (let i = 0; i < sortedDrivers.length; i++) {
          let driver = { ...sortedDrivers[i] };
          driverDest =
            driverDest + driver.location.lat + "," + driver.location.lng;
          if (i < sortedDrivers.length - 1) {
            driverDest = driverDest + "|";
          }
        }

        if (settings.useDistanceMatrix) {
          distArr = await getDistanceMatrix(startLoc, driverDest);
        } else {
          for (let i = 0; i < sortedDrivers.length; i++) {
            distArr.push({
              timein_text:
                (sortedDrivers[i].distance * 2 + 1).toFixed(0) + " min",
              found: true,
            });
          }
        }

        for (let i = 0; i < sortedDrivers.length; i++) {
          let driver = { ...sortedDrivers[i] };
          if (distArr[i].found) {
            driver.arriveTime = distArr[i];
            for (let i = 0; i < cars.length; i++) {
              if (cars[i].name == driver.carType) {
                driver.carImage = cars[i].image;
              }
            }
            let carType = driver.carType;
            if (arr[carType] && arr[carType].sortedDrivers) {
              arr[carType].sortedDrivers.push(driver);
              if (arr[carType].minDistance > driver.distance) {
                arr[carType].minDistance = driver.distance;
                arr[carType].minTime = driver.arriveTime.timein_text;
              }
            } else {
              arr[carType] = {};
              arr[carType].sortedDrivers = [];
              arr[carType].sortedDrivers.push(driver);
              arr[carType].minDistance = driver.distance;
              arr[carType].minTime = driver.arriveTime.timein_text;
            }
            availableDrivers.push(driver);
          }
        }
      }

      let carWiseArr = [];

      for (let i = 0; i < cars.length; i++) {
        let temp = { ...cars[i] };
        if (arr[cars[i].name]) {
          temp["nearbyData"] = arr[cars[i].name].drivers;
          temp["minTime"] = arr[cars[i].name].minTime;
          temp["available"] = true;
        } else {
          temp["minTime"] = "";
          temp["available"] = false;
        }
        temp["active"] =
          tripdata.carType && tripdata.carType.name == cars[i].name
            ? true
            : false;
        carWiseArr.push(temp);
      }

      setFreeCars(availableDrivers);
      setAllCarTypes(carWiseArr);
    }
  };

  const tapAddress = (selection) => {
    if (selection === tripdata.selected) {
      let savedAddresses = [];
      let allAddresses = profile.savedAddresses;
      for (let key in allAddresses) {
        savedAddresses.push(allAddresses[key]);
        console.log("savedAddresses =>>>>>>",savedAddresses)
      }
      if (selection == "drop") {
        props.navigation.navigate("Search", {
          locationType: "drop",
          addParam: savedAddresses,
        });
        // console.log("first123456")
      } else {
        props.navigation.navigate("Search", {
          locationType: "pickup",
          addParam: savedAddresses,
        });
      }
      console.log("first123456")
    } else {
      setDragging(0);
      if (
        selection == "drop" &&
        tripdata.selected &&
        tripdata.selected == "pickup"
      ) {
        mapRef.current.animateToRegion({
          latitude: tripdata.drop.lat,
          longitude: tripdata.drop.lng,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta,
        });
      }
      if (
        selection == "pickup" &&
        tripdata.selected &&
        tripdata.selected == "drop"
      ) {
        mapRef.current.animateToRegion({
          latitude: tripdata.pickup.lat,
          longitude: tripdata.pickup.lng,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta,
        });
      }
      dispatch(updatSelPointType(selection));
    }
  };

  //Go to confirm booking page
  const onPressBook = async () => {
    setCheckType(true);
    setBookLoading(true);
    if (!(profile.mobile && profile.mobile.length > 6)) {
      Alert.alert(t("alert"), t("mobile_need_update"));
      props.navigation.navigate("editUser");
      setBookLoading(false);
    } else {
      if (tripdata.pickup && tripdata.drop && tripdata.drop.add) {
        if (!tripdata.carType) {
          //todo  fix this later
          // props.route.params.name==="Car"
          setBookLoading(false);
          Alert.alert(t("alert"), t("car_type_blank_error"));
        } else {
          let driver_available = false;
          for (let i = 0; i < allCarTypes.length; i++) {
            let car = allCarTypes[i];
            if (car.name == tripdata.carType.name && car.minTime) {
              driver_available = true;
              break;
            }
          }
          if (driver_available) {
            setBookingDate(null);
            setBookingType(false);
            if (
              (Array.isArray(tripdata.carType.options) ||
                Array.isArray(tripdata.carType.parcelTypes)) &&
              appcat == "delivery"
            ) {
              setOptionModalStatus(true);
              setBookLoading(false);
            } else {
              const startLoc = tripdata.pickup.lat + "," + tripdata.pickup.lng;
              const destLoc = tripdata.drop.lat + "," + tripdata.drop.lng;
              let routeDetails = null;
              let waypoints = "";
              try {
                if (
                  tripdata.drop &&
                  tripdata.drop.waypoints &&
                  tripdata.drop.waypoints.length > 0
                ) {
                  const origin =
                    tripdata.pickup.lat + "," + tripdata.pickup.lng;
                  const arr = tripdata.drop.waypoints;
                  for (let i = 0; i < arr.length; i++) {
                    waypoints = waypoints + arr[i].lat + "," + arr[i].lng;
                    if (i < arr.length - 1) {
                      waypoints = waypoints + "|";
                    }
                  }
                  const destination =
                    tripdata.drop.lat + "," + tripdata.drop.lng;
                  routeDetails = await getDirectionsApi(
                    origin,
                    destination,
                    waypoints
                  );
                } else {
                  routeDetails = await getDirectionsApi(
                    startLoc,
                    destLoc,
                    null
                  );
                }
                const estimateObject = {
                  pickup: {
                    coords: {
                      lat: tripdata.pickup.lat,
                      lng: tripdata.pickup.lng,
                    },
                    description: tripdata.pickup.add,
                  },
                  drop: {
                    coords: { lat: tripdata.drop.lat, lng: tripdata.drop.lng },
                    description: tripdata.drop.add,
                    waypointsStr: waypoints != "" ? waypoints : null,
                    waypoints: waypoints != "" ? tripdata.drop.waypoints : null,
                  },
                  carDetails: tripdata.carType,
                  routeDetails: routeDetails,
                };
                if (appcat == "delivery") {
                  estimateObject["instructionData"] = instructionData;
                }
                // console.log({...estimateObject.pickup,},'✋')
                dispatch(getEstimate(estimateObject));
              } catch (err) {
                setBookLoading(false);
                Alert.alert(t("alert"), t("not_available"));
              }
            }
          } else {
            Alert.alert(t("alert"), t("no_driver_found_alert_messege"));
            setBookLoading(false);
          }
        }
      } else {
        Alert.alert(t("alert"), t("drop_location_blank_error"));
        setBookLoading(false);
      }
    }
  };

  const onPressBookLater = () => {
    setCheckType(false);
    if (!(profile.mobile && profile.mobile.length > 6)) {
      Alert.alert(t("alert"), t("mobile_need_update"));
      props.navigation.navigate("editUser");
    } else {
      if (tripdata.pickup && tripdata.drop && tripdata.drop.add) {
        if (tripdata.carType) {
          setPickerConfig({
            dateMode: "date",
            dateModalOpen: true,
            selectedDateTime: pickerConfig.selectedDateTime,
          });
        } else {
          Alert.alert(t("alert"), t("car_type_blank_error"));
        }
      } else {
        Alert.alert(t("alert"), t("drop_location_blank_error"));
      }
    }
  };

  const hideDatePicker = () => {
    setPickerConfig({
      dateModalOpen: false,
      selectedDateTime: pickerConfig.selectedDateTime,
      dateMode: "date",
    });
  };

  const handleDateConfirm = (date) => {
    if (pickerConfig.dateMode === "date") {
      setPickerConfig({
        dateModalOpen: false,
        selectedDateTime: date,
        dateMode: pickerConfig.dateMode,
      });
      setTimeout(() => {
        setPickerConfig({
          dateModalOpen: true,
          selectedDateTime: date,
          dateMode: "time",
        });
      }, 1000);
    } else {
      setPickerConfig({
        dateModalOpen: false,
        selectedDateTime: date,
        dateMode: "date",
      });
      setBookLaterLoading(true);
      setTimeout(async () => {
        const diffMins = MinutesPassed(date);
        if (diffMins < 15) {
          setBookLaterLoading(false);
          Alert.alert(
            t("alert"),
            t("past_booking_error"),
            [{ text: t("ok"), onPress: () => {} }],
            { cancelable: true }
          );
        } else {
          setBookingDate(date);
          setBookingType(true);
          if (
            (Array.isArray(tripdata.carType.options) ||
              Array.isArray(tripdata.carType.parcelTypes)) &&
            appcat == "delivery"
          ) {
            setOptionModalStatus(true);
            setBookLaterLoading(false);
          } else {
            const startLoc = tripdata.pickup.lat + "," + tripdata.pickup.lng;
            const destLoc = tripdata.drop.lat + "," + tripdata.drop.lng;
            let routeDetails = null;
            let waypoints = "";
            try {
              if (
                tripdata.drop &&
                tripdata.drop.waypoints &&
                tripdata.drop.waypoints.length > 0
              ) {
                const origin = tripdata.pickup.lat + "," + tripdata.pickup.lng;
                const arr = tripdata.drop.waypoints;
                for (let i = 0; i < arr.length; i++) {
                  waypoints = waypoints + arr[i].lat + "," + arr[i].lng;
                  if (i < arr.length - 1) {
                    waypoints = waypoints + "|";
                  }
                }
                const destination = tripdata.drop.lat + "," + tripdata.drop.lng;
                routeDetails = await getDirectionsApi(
                  origin,
                  destination,
                  waypoints
                );
              } else {
                routeDetails = await getDirectionsApi(startLoc, destLoc, null);
              }
              const estimateObject = {
                pickup: {
                  coords: {
                    lat: tripdata.pickup.lat,
                    lng: tripdata.pickup.lng,
                  },
                  description: tripdata.pickup.add,
                },
                drop: {
                  coords: { lat: tripdata.drop.lat, lng: tripdata.drop.lng },
                  description: tripdata.drop.add,
                  waypointsStr: waypoints != "" ? waypoints : null,
                  waypoints: waypoints != "" ? tripdata.drop.waypoints : null,
                },
                carDetails: tripdata.carType,
                routeDetails: routeDetails,
              };
              if (appcat == "delivery") {
                estimateObject["instructionData"] = instructionData;
              }
              dispatch(getEstimate(estimateObject));
            } catch (err) {
              setBookLoading(false);
              Alert.alert(t("alert"), t("not_available"));
            }
          }
        }
      }, 1000);
    }
  };

  const handleGetEstimate = async () => {
    if (checkType) {
      setBookLoading(true);
    } else {
      setBookLaterLoading(true);
    }
    setOptionModalStatus(false);
    const startLoc = tripdata.pickup.lat + "," + tripdata.pickup.lng;
    const destLoc = tripdata.drop.lat + "," + tripdata.drop.lng;
    try {
      const routeDetails = await getDirectionsApi(startLoc, destLoc, null);
      const estimateObject = {
        pickup: {
          coords: { lat: tripdata.pickup.lat, lng: tripdata.pickup.lng },
          description: tripdata.pickup.add,
        },
        drop: {
          coords: { lat: tripdata.drop.lat, lng: tripdata.drop.lng },
          description: tripdata.drop.add,
        },
        carDetails: tripdata.carType,
        instructionData: instructionData,
        routeDetails: routeDetails,
      };
      dispatch(getEstimate(estimateObject));
    } catch (err) {
      setBookLoading(false);
      Alert.alert(t("alert"), t("not_available"));
    }
  };

  const handleParcelTypeSelection = (value) => {
    setInstructionData({
      ...instructionData,
      parcelTypeIndex: value,
      parcelTypeSelected: tripdata.carType.parcelTypes[value],
    });
  };

  const handleOptionSelection = (value) => {
    setInstructionData({
      ...instructionData,
      optionIndex: value,
      optionSelected: tripdata.carType.options[value],
    });
  };

  const onModalCancel = () => {
    setInstructionData(instructionInitData);
    setTripInstructions("");
    setRoundTrip(false);
    dispatch(updateTripCar(null));
    setBookingModalStatus(false);
    setOptionModalStatus(false);
    resetActiveCar();
  };

  const bookNow = async () => {
    let tempProfile = await readProfile();
    let wallet_balance = tempProfile.walletBalance;
    if (wallet_balance >= 0) {
      if (appcat == "delivery") {
        const regx1 =
          /([0-9\s-]{7,})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
        if (
          /\S/.test(instructionData.deliveryPerson) &&
          regx1.test(instructionData.deliveryPersonPhone) &&
          instructionData.deliveryPersonPhone &&
          instructionData.deliveryPersonPhone.length > 6
        ) {
          const addBookingObj = {
            pickup: estimatedata.estimate.pickup,
            drop: estimatedata.estimate.drop,
            carDetails: estimatedata.estimate.carDetails,
            userDetails: auth.info,
            estimate: estimatedata.estimate,
            instructionData: instructionData,
            tripdate: bookingType
              ? new Date(bookingDate).getTime()
              : new Date().getTime(),
            bookLater: bookingType,
            settings: settings,
            booking_type_admin: false,
          };
          dispatch(addBooking(addBookingObj));
          setInstructionData(instructionInitData);
          dispatch(clearTripPoints());
          setBookingModalStatus(false);
          setOptionModalStatus(false);
          resetCars();
        } else {
          Alert.alert(t("alert"), t("deliveryDetailMissing"));
        }
      } else {
        const addBookingObj = {
          pickup: estimatedata.estimate.pickup,
          drop: estimatedata.estimate.drop,
          carDetails: estimatedata.estimate.carDetails,
          userDetails: auth.info,
          estimate: estimatedata.estimate,
          additionalInfo: additionalInfo,
          tripdate: bookingType
            ? new Date(bookingDate).getTime()
            : new Date().getTime(),
          bookLater: bookingType,
          settings: settings,
          booking_type_admin: false,
        };
        if (appcat == "rentals") {
          addBookingObj["roundTrip"] = roundTrip;
          addBookingObj["tripInstructions"] = tripInstructions;
        }
        if (settings.autoDispatch && bookingType == false) {
          let requestedDrivers = {};
          for (let i = 0; i < drivers.length; i++) {
            let driver = { ...drivers[i] };
            let distance = GetDistance(
              tripdata.pickup.lat,
              tripdata.pickup.lng,
              driver.location.lat,
              driver.location.lng
            );
            if (settings.convert_to_mile) {
              distance = distance / 1.609344;
            }
            if (
              distance <
                (settings && settings.driverRadius
                  ? settings.driverRadius
                  : 10) &&
              estimatedata.estimate.carDetails.name == driver.carType
            ) {
              requestedDrivers[driver["id"]] = true;
            }
          }
          addBookingObj["requestedDrivers"] = requestedDrivers;
        }
        // console.log(addBookingObj)
        dispatch(addBooking(addBookingObj));
        setTripInstructions("");
        setRoundTrip(false);
        dispatch(clearTripPoints());
        setBookingModalStatus(false);
        resetCars();
      }
    } else {
      Alert.alert(t("alert"), t("wallet_balance_zero_customer"));
    }
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      dispatch(fetchDrivers());
      if (intVal.current == 0) {
        intVal.current = setInterval(() => {
          dispatch(fetchDrivers());
        }, 30000);
      }
    });
    return unsubscribe;
  }, [props.navigation, intVal.current]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("blur", () => {
      intVal.current ? clearInterval(intVal.current) : null;
      intVal.current = 0;
    });
    return unsubscribe;
  }, [props.navigation, intVal.current]);

  useEffect(() => {
    pageActive.current = true;
    const interval = setInterval(() => {
      dispatch(fetchDrivers());
    }, 30000);
    intVal.current = interval;
    return () => {
      clearInterval(interval);
      intVal.current = 0;
    };
  }, []);
  //! <<=====================>>
  const [check, setCheck] = useState(false);
  const [cash, setCash] = useState(-1);
  const [counter, setCounter] = useState(1);
  const [gList, setGList] = useState([1]);
  const [isPanelActive, setIsPanelActive] = useState(false);
  const animations = useSharedValue({
    width: width,
    height: next ? height / 1.2 : height / 1.5,
  });
  const displayAnimation = useSharedValue({ opacity: 1, height: height / 5 });

  const displayAnimationStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(displayAnimation.value.height, {
        duration: 1000,
      }),
      opacity: withTiming(displayAnimation.value.opacity, {
        duration: 600,
      }),
    };
  });
  const animationsStyle = useAnimatedStyle(() => {
    return {
      // width: withTiming(animations.value.width, {
      //   duration: 1000,
      // }),
      height: withTiming(animations.value.height, {
        duration: 500,
      }),
    };
  });
  const openPanel = () => {
    setIsPanelActive(true);
  };

  const closePanel = () => {
    setIsPanelActive(false);
  };

  const animateMap = () => {
    console.log("animations", animations.value.height);
    if (animations.value.height === height / 1.5) {
      displayAnimation.value = { opacity: 0, height: 0 };
      animations.value = { height: height / 1.2 };
    } else {
      displayAnimation.value = { opacity: 1, height: height / 5 };
      animations.value = { height: height / 1.5 };
    }
  };

  //   const [carRideAdditionalInfo, setCarRideAdditionalInfo] = useState({
  //     pickup:"",
  //     dropOff:"",
  //     note:""
  //   });
  //   const [padalaAdditionalInfo, setPadalaAdditionalInfo] = useState({
  //     pickup:"",
  //     phone:"",
  //     name:"",
  //     note:"",
  //   });
  const [additionalInfo, setAdditionalInfo] = useState({
    pickup: "",
    dropOff: "",
    phone: "",
    name: "",
    merchantName: "",
    landmark: "",
    paymentMethod: "",
    groceryList: gList,
    note: "",
    screenName: screenName,
  });

  const inputData = [
    {
      id: 1,
      withLabel: "Pick-Up Address details",
      placeholder: "Unit number & Street number",
      onChangeText: (v) => setAdditionalInfo({ ...additionalInfo, pickup: v }),
    },
    {
      id: 2,
      withLabel: "Drop-Off Address details",
      placeholder: "Unit number & Street number",
      onChangeText: (v) => setAdditionalInfo({ ...additionalInfo, dropOff: v }),
    },
    {
      id: 3,
      withLabel: "Note to Driver",
      placeholder: "Write note here...",
      onChangeText: (v) => setAdditionalInfo({ ...additionalInfo, note: v }),
    },
  ];
  const padalaForm = [
    {
      id: 1,
      withLabel: "",
      placeholder: "Unit number & Street number",
      onChangeText: (v) => setAdditionalInfo({ ...additionalInfo, pickup: v }),
    },
    {
      id: 2,
      withLabel: "",
      placeholder: "Contact Number",
      icon: images.phone,
      onChangeText: (v) => setAdditionalInfo({ ...additionalInfo, phone: v }),
    },
    {
      id: 3,
      withLabel: "",
      placeholder: "Contact Name",
      icon: images.user,
      onChangeText: (v) => setAdditionalInfo({ ...additionalInfo, name: v }),
    },
    {
      id: 4,
      withLabel: "Items Description",
      placeholder: "Write description here...",
      onChangeText: (v) => setAdditionalInfo({ ...additionalInfo, note: v }),
    },
  ];
  const pabiliForm = [
    {
      id: 1,
      withLabel: "Merchant Name",
      placeholder: "Name of Establishment",
      onChangeText: (v) =>
        setAdditionalInfo({ ...additionalInfo, merchantName: v }),
    },
    {
      id: 2,
      withLabel: "Landmark",
      placeholder: "Nearby known Establishment Name",
      icon: images.phone,
      onChangeText: (v) =>
        setAdditionalInfo({ ...additionalInfo, landmark: v }),
    },
    {
      id: 3,
      withLabel: "Payment Method",
      placeholder: "",
      icon: images.gCash,
      onChangeText: (v) =>
        setAdditionalInfo({ ...additionalInfo, paymentMethod: v }),
    },
    {
      id: 4,
      withLabel: "Item to Purchased",
      placeholder: "Products/Items Description",
      icon: images.user,
      //   onChangeText:(v)=>(setAdditionalInfo({...additionalInfo,pickup:v}))
    },
    {
      id: 5,
      withLabel: "Note to Pabili Driver",
      placeholder: "Write note here...",
      onChangeText: (v) => setAdditionalInfo({ ...additionalInfo, note: v }),
    },
  ];
  useEffect(() => {
    //   console.log(cars[0])
    setTimeout(() => {
      console.log(cars?.[0]?.name, cars?.[0]?.id);
      // selectCarType(allCarTypes, key);
      if (screenName === "Ride") {
        selectCarType(cars?.[0], cars?.[0]?.id);
      } else if (screenName === "Car") {
        selectCarType(cars?.[1], cars?.[1]?.id);
      } else if (screenName === "Pabili") {
        selectCarType(cars?.[1], cars?.[1]?.id);
      }
    }, 1000);
  }, []);
  useEffect(() => {
    setNext(false);
    console.log(gList);
  }, [gList]);

  // useEffect(() => {
  //   gList.push(1);
  // }, [counter]);

  useEffect(() => {
    // console.log("first");
    dispatch({
      type: "ADD_ADDITIONAL_DATA",
      payload: additionalInfo,
    });
  }, [additionalInfo]);

  //* <<========BottomSheet=========>>
  const animatedValue = useRef(new Animated.Value(0)).current;
  const lastGesture = useRef(0);
  const dragThreshold = 50;
  const springAnimation = (direction) => {
    lastGesture.current = direction === "down" ? 0 : height / 10 - height / 1.5;
    Animated.spring(animatedValue, {
      toValue: lastGesture.current,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        console.log("grant", lastGesture.current);
        animatedValue.setOffset(lastGesture.current);
      },
      onPanResponderMove: (e, gesture) => {
        console.log("move", gesture.dy);
        animatedValue.setValue(gesture.dy);
      },
      onPanResponderRelease: (e, gesture) => {
        console.log("release", gesture.dy);
        animatedValue.flattenOffset();
        // lastGesture.current += gesture.dy;
        // if (lastGesture.current < height / 10 - height / 1.5) {
        //   lastGesture.current = height / 10 - height / 1.5;
        // } else if (lastGesture.current > 0) {
        //   lastGesture.current = 0;
        // }

        if (gesture.dy > 0) {
          if (gesture.dy <= dragThreshold) {
            springAnimation("up");
          } else {
            springAnimation("down");
          }
        } else {
          if (gesture.dy >= -dragThreshold) {
            springAnimation("down");
          } else {
            springAnimation("up");
          }
        }
      },
    })
  ).current;

  const bottomSheetAnimatedValue = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [height / 10 - height / 1.5, 0],
          outputRange: [height / 10 - height / 1.5, 0],
          extrapolate: "clamp",
        }),
      },
    ],
  };
  //* <<=====================>>
  const CashButton = ({ name, index, cash, onPress, icon }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        // padding: 20,
        backgroundColor: colors.WHITE,
        elevation: 5,
        borderRadius: 10,
        alignItems: "center",
        width: width / 2.5,
        height: 50,
        paddingHorizontal: 20,
        flexDirection: "row",
      }}
    >
      <View
        style={{
          height: 20,
          width: 20,
          borderRadius: 10,
          borderColor: colors.primary,
          borderWidth: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {cash === index ? (
          <View
            style={{
              borderRadius: 7,
              backgroundColor: colors.primary,
              width: 13,
              height: 13,
            }}
          />
        ) : (
          <></>
        )}
      </View>
      <Spacer width={icon ? 10 : 20} />
      {icon ? (
        <Image
          source={icon}
          resizeMode={"contain"}
          style={{ height: 70, width: 70 }}
        />
      ) : (
        <CustomText
          label={name}
          fontSize={verticalScale(9)}
          fontFamily={"Roboto-Regular"}
        />
      )}
    </TouchableOpacity>
  );
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

  //! <<=====================>>
  const isDarkTheme = useColorScheme() === "light";

  return (
    <View
      style={{ backgroundColor: colors.WHITE, flex: 1 }}
      // stickyHeaderIndices={[1]}

      // StickyHeaderComponent={()=><View style={{height:100,width:100,backgroundColor:colors.BLACK}}></View>}
    >
      <Spacer height={20} />
      <View
        style={{
          
          width: "100%",
          backgroundColor: "white",
          paddingHorizontal: 20,
          // zIndex:100,
        }}
      >
        <Spacer height={20} />

        <MainTopHeader
          txt={props?.route?.params?.name}

          img={
            props?.route?.params?.name === "Car"
              ? images.car
              : props?.route?.params?.name === "Ride"
              ? images.bike
              : props?.route?.params?.name === "Padala"
              ? images.time
              : images.cart
          }
          openDrawer={() => {
            props.navigation.dispatch(DrawerActions.toggleDrawer());
          }}
        />

        <Spacer height={20} />
      </View>
      {/* <Modal
        isVisible={true}
        swipeDirection={["up", "down", "left", "right"]}
      
        onSwipeComplete={({ swipingDirection }) => null}
      >
        <View style={{ backgroundColor: "white",}}>
          <Text>I am the modal content!</Text>
        </View>
      </Modal> */}
      <View
        style={[
          {
            paddingHorizontal: 20,
            width: "100%",
            backgroundColor: "white",
          },
          animationsStyle,
        ]}
      >
        {screenName === "Pabili" ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                alignItems: "center",
                marginRight: scale(20),
                flex: 1,
              }}
            >
              {/* <BlurCircle/> */}
              {/* <Spacer height={5} /> */}
              {/* <CustomText label="...." /> */}

              <Image
                source={require("../../assets/images/location.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>

            <View
              style={{
                marginRight: scale(20),
                justifyContent: "center",
                flex: 9,
              }}
            >
              <>
                {!next ? (
                  <TouchableOpacity
                    onPressIn={() => tapAddress("pickup")}
                    activeOpacity={0.6}
                    style={{
                      borderWidth: 1,
                      borderRadius: 8,
                      borderColor: "#ccc",
                      paddingVertical: 15,
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text style={{}} numberOfLines={1}>
                      {tripdata.pickup && tripdata.pickup.add
                        ? tripdata.pickup.add
                        : t("map_screen_where_input_text")}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <></>
                )}
                {/* <Spacer height={20} /> */}
                {next ? (
                  <>
                    <TouchableOpacity
                      onPressIn={() => tapAddress("drop")}
                      activeOpacity={0.6}
                      style={{
                        borderWidth: 1,
                        borderRadius: 8,
                        borderColor: "#ccc",
                        paddingVertical: 15,
                        paddingHorizontal: 10,
                      }}
                    >
                      <Text style={{}} numberOfLines={1}>
                        {tripdata.drop && tripdata.drop.add
                          ? tripdata.drop.add
                          : t("map_screen_drop_input_text")}
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <></>
                )}
                <Spacer height={10} />
              </>
            </View>
          </View>
        ) : screenName === "Padala" && next ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                alignItems: "center",
                marginRight: scale(20),
                flex: 1,
              }}
            >
              <Image
                source={require("../../assets/images/location.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>

            <View
              style={{
                marginRight: scale(20),
                justifyContent: "center",
                flex: 9,
              }}
            >
              <>
                {next ? (
                  <>
                    <TouchableOpacity
                      onPressIn={() => tapAddress("drop")}
                      activeOpacity={0.6}
                      style={[
                        {
                          borderWidth: 1,
                          borderRadius: 8,
                          borderColor: "#ccc",
                          paddingVertical: 15,
                          paddingHorizontal: 10,
                        },
                      ]}
                    >
                      <Text style={{}} numberOfLines={1}>
                        {tripdata.drop && tripdata.drop.add
                          ? tripdata.drop.add
                          : t("map_screen_drop_input_text")}
                      </Text>
                    </TouchableOpacity>
                    <Spacer height={10} />
                  </>
                ) : (
                  <></>
                )}
              </>
            </View>
          </View>
        ) : (
          <TopRideContainer
            // displayAnimation={displayAnimation}
            displayAnimationStyle={displayAnimationStyle}
            tripdata={tripdata}
            onAddShop={() => props?.navigation.navigate("BookPadala")}
            tapAddress={tapAddress}
          />
        )}
      </View>

      <Animated.View style={[styles.mapcontainer, animationsStyle]}>
        {region && region.latitude ? (
          <MapView
            onTouchStart={() => animateMap()}
            onTouchEnd={() => animateMap()}
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            loadingEnabled
            showsMyLocationButton={false}
            style={styles.mapViewStyle}
            initialRegion={region}
            onRegionChangeComplete={onRegionChangeComplete}
            onPanDrag={() => setDragging(30)}
            minZoomLevel={13}
          >
            {freeCars
              ? freeCars.map((item, index) => {
                  return (
                    <Marker.Animated
                      coordinate={{
                        latitude: item?.location ? item?.location.lat : 0.0,
                        longitude: item?.location ? item?.location.lng : 0.0,
                      }}
                      key={index}
                    >
                      <Image
                        key={index}
                        source={{ uri: item?.carImage }}
                        style={{
                          height: 40,
                          width: 40,
                          resizeMode: "contain",
                        }}
                      />
                    </Marker.Animated>
                  );
                })
              : null}
          </MapView>
        ) : null}
        {region ? (
          tripdata.selected == "pickup" ? (
            <View pointerEvents="none" style={styles.mapFloatingPinView}>
                <Image pointerEvents="none" style={[styles.mapFloatingPin,{ marginBottom: Platform.OS =='ios'? (hasNotch? (-10 + dragging) :33): 40}]} resizeMode="contain" source={images.userLocation} />
            </View>
            // <View style={{ position: "absolute" }}>
            //   <View
            //     style={{
            //       // display: "flex",
            //       justifyContent: "center",
            //       alignItems: "center",
            //       height: 40,
            //       width: 45,
            //       backgroundColor: colors.primary,
            //       borderRadius: 15,
            //     }}
            //   >
            //     <AntDesign
            //       name="user"
            //       size={18}
            //       color={colors.WHITE}
            //       style={{
            //         alignSelf: "center",
            //       }}
            //     />
            //   </View>
            //   <View style={{ justifyContent: "center", alignItems: "center" }}>
            //     <AntDesign
            //       name="caretdown"
            //       size={20}
            //       color={colors.primary}
            //       style={{ alignSelf: "center", marginTop: -7 }}
            //     />
            //     <View
            //       style={{
            //         height: 12,
            //         width: 12,
            //         borderRadius: 6,
            //         backgroundColor: colors.primary,
            //         opacity: 0.5,
            //         marginTop: -9,
            //       }}
            //     />
            //   </View>
            // </View>
          ) : (
            <View pointerEvents="none" style={styles.mapFloatingPinView}>
              <Image
                pointerEvents="none"
                style={[
                  styles.mapFloatingPin,
                  {
                    marginBottom:
                      Platform.OS == "ios"
                        ? hasNotch
                          ? -10 + dragging
                          : 33
                        : 40,
                  },
                ]}
                resizeMode="contain"
                source={images.location1}
              />
            </View>
          )
        ) : null}
        {tripdata.selected == "pickup" ? (
          <View
            style={[
              styles.locationButtonView,
              {
                bottom:
                  settings && settings.horizontal_view
                    ? 180
                    : isEditing
                    ? 260
                    : 40,
              },
            ]}
          >
            <TouchableOpacity
              onPress={locateUser}
              style={styles.locateButtonStyle}
            >
              <Icon name="gps-fixed" color={"#666699"} size={26} />
            </TouchableOpacity>
          </View>
        ) : null}
        {locationRejected ? (
          <View
            style={{
              flex: 1,
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Text>{t("location_permission_error")}</Text>
          </View>
        ) : null}
      </Animated.View>
      {/* <Swipup onPressIn={() => openPanel()} /> */}
      <Animated.View style={[styles.bottomSheet, bottomSheetAnimatedValue]}>
        <View style={styles.draggableArea} {...panResponder.panHandlers}>
          <View style={styles.dragHandle} />
        </View>
        <ScrollView>
          {/* <PanelContent /> Your Content Here */}
          {screenName === "Padala" ? (
            next ? (
              <View style={commonStyles.PH30}>
                <Spacer height={20} />
                <CustomText
                  label={"PickUp Address details"}
                  fontSize={verticalScale(9)}
                  //   color={colors.FOOTERTOP}
                  fontFamily={"Roboto-Regular"}
                  //   fontWeight={"700"}
                  marginBottom={verticalScale(7)}
                  marginLeft={20}
                />
                {padalaForm.map((item, index) => (
                  <>
                    <CustomTextInput
                      multiline={index === 3 ? true : false}
                      withLabel={item?.withLabel}
                      placeholder={item?.placeholder}
                      fontSize={12}
                      paddingLeft={20}
                      // paddingTop={10}
                      placeholderTextColor={"#9C9C9C"}
                      fontFamily={"Roboto-Light"}
                      rightLabel={item.icon}
                      onChangeText={item.onChangeText}
                    />
                    <Spacer height={20} />
                    {index === 2 ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 20,
                        }}
                      >
                        <Spacer width={10} />
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
                        <CustomText
                          label={"Save this address"}
                          color={colors.PROMO}
                          fontSize={12}
                          fontFamily="Roboto-Regular"
                          marginLeft={10}
                        />
                      </View>
                    ) : (
                      <></>
                    )}
                  </>
                ))}
              </View>
            ) : (
              <View>
                {allCarTypes.map((prop, key) => (
                  <TouchableOpacity
                    onPress={() => {
                      selectCarType(prop, key);
                      setIsCollapsed(false);
                    }}
                    style={{
                      backgroundColor: colors.WHITE,
                      borderColor:
                        prop.active == true ? colors.primary : colors.WHITE,
                      borderWidth: 2,
                      elevation: 5,
                      borderRadius: 10,
                      // flexDirection: "row",
                      // alignItems: "center",
                      // justifyContent: "center",
                      // paddingRight: 50,
                      paddingVertical: 10,
                      marginHorizontal: 30,
                      marginVertical: 10,
                      transform: [{ scale: prop.active == true ? 1.04 : 1 }],
                    }}
                  >
                    <View style={{ position: "absolute", right: 10, top: 10 }}>
                      {prop.active == true ? (
                        <Feather
                          name="check-circle"
                          size={24}
                          color={colors.primary}
                          style={{}}
                        />
                      ) : (
                        <></>
                      )}
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View style={{ flex: 4, alignItems: "center" }}>
                        <Image
                          resizeMode="contain"
                          source={
                            prop?.image
                              ? { uri: prop?.image }
                              : require("../../assets/images/microBlackCar.png")
                          }
                          style={{
                            height: 40,
                            width: 40,
                            tintColor: colors.primary,
                          }}
                        />
                      </View>
                      <View
                        style={{
                          flex: 6,
                          alignItems:
                            prop.active == true ? "flex-start" : "center",
                          // flexDirection:prop.active == true ?"row":"column"
                        }}
                      >
                        <Text
                          style={{ ...styles.titleStyles, marginRight: 50 }}
                        >
                          {prop?.name.toUpperCase()}
                        </Text>
                        {prop.active == true ? (
                          prop.extra_info && prop.extra_info != "" ? (
                            <View style={{ justifyContent: "space-around" }}>
                              {prop.extra_info.split().map((ln) => (
                                <Text
                                  key={ln}
                                  style={[
                                    styles.text2,
                                    {
                                      fontWeight: "bold",
                                      color: colors.MAP_TEXT,
                                    },
                                  ]}
                                >
                                  {ln}
                                </Text>
                              ))}
                            </View>
                          ) : null
                        ) : (
                          <></>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )
          ) : (
            <View style={commonStyles.PH30}>
              {screenName === "Pabili" ? (
                next ? (
                  <>
                    <Spacer height={20} />
                    <CustomText
                      label={"PickUp Address details"}
                      fontSize={verticalScale(9)}
                      //   color={colors.FOOTERTOP}
                      fontFamily={"Roboto-Regular"}
                      //   fontWeight={"700"}
                      marginBottom={verticalScale(7)}
                      marginLeft={20}
                    />
                    {padalaForm.map((item, index) => (
                      <>
                        <CustomTextInput
                          multiline={index === 3 ? true : false}
                          withLabel={item?.withLabel}
                          placeholder={item?.placeholder}
                          fontSize={12}
                          paddingLeft={20}
                          // paddingTop={10}
                          placeholderTextColor={"#9C9C9C"}
                          fontFamily={"Roboto-Light"}
                          rightLabel={item.icon}
                          onChangeText={item.onChangeText}
                        />
                        <Spacer height={20} />
                        {index === 2 ? (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginBottom: 20,
                            }}
                          >
                            <Spacer width={10} />
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
                            <CustomText
                              label={"Save this address"}
                              color={colors.PROMO}
                              fontSize={12}
                              fontFamily="Roboto-Regular"
                              marginLeft={10}
                            />
                          </View>
                        ) : (
                          <></>
                        )}
                      </>
                    ))}
                  </>
                ) : (
                  <>
                    <Spacer height={20} />
                    {pabiliForm.map((item, index) =>
                      index === 2 ? (
                        <View>
                          <CustomText
                            label={item?.withLabel}
                            fontSize={verticalScale(9)}
                            //   color={colors.FOOTERTOP}
                            fontFamily={"Roboto-Regular"}
                            //   fontWeight={"700"}
                            marginBottom={verticalScale(7)}
                            marginLeft={20}
                          />
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            {["Cash", "G Cash"].map((c, index) => (
                              <CashButton
                                name={c}
                                cash={cash}
                                index={index}
                                icon={index === 1 ? item.icon : ""}
                                onPress={() => setCash(index)}
                              />
                            ))}
                          </View>
                          <Spacer height={20} />
                        </View>
                      ) : index === 3 ? (
                        <View style={{ maxHeight: 300 }}>
                          <CustomText
                            label={item?.withLabel}
                            fontSize={verticalScale(9)}
                            //   color={colors.FOOTERTOP}
                            fontFamily={"Roboto-Regular"}
                            //   fontWeight={"700"}
                            marginBottom={verticalScale(7)}
                            marginLeft={20}
                          />
                          <ScrollView nestedScrollEnabled={true}>
                            {gList.map((p, i) => (
                              <>
                                <GroceryListItem
                                  label={item.label}
                                  placeholder={item.placeholder}
                                  index={i}
                                  gList={gList}
                                  setGList={setGList}
                                />
                                <Spacer height={10} />
                              </>
                            ))}
                          </ScrollView>
                          <View
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Spacer height={20} />
                            <AddlButton
                              label="Add More Items"
                              width={"60%"}
                              height={verticalScale(37)}
                              // onPress={onAddShop}
                              icon={images.add}
                              textColor={colors.primary}
                              onPress={() => {
                                console.log(gList.length);
                                setGList([...gList, 1]);
                              }}
                            />
                          </View>
                          <Spacer height={20} />
                        </View>
                      ) : (
                        <>
                          <CustomTextInput
                            withLabel={item?.withLabel}
                            placeholder={item?.placeholder}
                            fontSize={12}
                            paddingLeft={20}
                            // paddingTop={10}
                            placeholderTextColor={"#9C9C9C"}
                            fontFamily={"Roboto-Light"}
                            onChangeText={item.onChangeText}
                          />
                          <Spacer height={20} />
                        </>
                      )
                    )}
                  </>
                )
              ) : (
                <>
                  <Spacer height={20} />
                  {inputData.map((item) => {
                    return (
                      <>
                        <CustomTextInput
                          withLabel={item?.withLabel}
                          placeholder={item?.placeholder}
                          fontSize={12}
                          paddingLeft={20}
                          // paddingTop={10}
                          placeholderTextColor={"#9C9C9C"}
                          fontFamily={"Roboto-Light"}
                          onChangeText={item.onChangeText}
                        />
                        <Spacer height={20} />
                      </>
                    );
                  })}
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Spacer width={10} />
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
                    <CustomText
                      label={"Save this address"}
                      color={colors.grayBorder}
                      fontSize={12}
                      fontFamily="Roboto-Regular"
                      marginLeft={10}
                    />
                  </View>
                </>
              )}
            </View>
          )}

          {/* //!original Header */}
          {/* <View style={[styles.menuIcon, isRTL ? {right:20}:{left:20}]}>
                   <TouchableOpacity onPress={() => { props.navigation.dispatch(DrawerActions.toggleDrawer()) }} style={styles.menuIconButton} >
                       <Icon
                           name='menu'
                           type='ionicon'
                           color='#517fa4'
                           size={32}
                       />
                   </TouchableOpacity>
               </View> */}
          {/* {activeBookings && activeBookings.length >= 1 ?
                   <View style={isRTL ? styles.topTitle1 : styles.topTitle}>
                       <TouchableOpacity onPress={() => {
                           props.navigation.navigate('RideList');
                       }}>
                           <Text style={{ marginHorizontal: 7, textAlign: 'center', color: '#517fa4', fontFamily: 'Roboto-Bold', fontSize: 14 }}>{t('active_booking')} - {activeBookings.length} </Text>

                       </TouchableOpacity>
                   </View>
                   :
                   <View style={[isRTL ? styles.topTitle1 : styles.topTitle, { width: 110}]}>
                       <Text style={{ marginHorizontal: 7, textAlign: 'center', color: '#517fa4', fontFamily: 'Roboto-Bold', fontSize: 18, }}>{t('home')}</Text>
                   </View>
               } */}
          {/* //? LocationAddress */}
          {/* <View style={[styles.addressBar,{flexDirection: isRTL? 'row-reverse' : 'row'}]}>
                   <View style={styles.ballandsquare}>
                       <BlurCircle/>
                       <View style={styles.hbox1} />
                       <View style={styles.hbox2} />
                       <View style={styles.hbox3} />
                       <View style={{ height: 30, width: 30,alignItems:'center'  }}>
                   <Image
                     source={require("../../assets/images/location.png")}
                     style={{ height: 20, width: 20 }}
                     resizeMode={"contain"}
                   />
                 </View>
                   </View>
                   <View style={[styles.contentStyle, isRTL? {paddingRight: 10} : {paddingLeft: 10}]}>
                       <TouchableOpacity onPress={() => tapAddress('pickup')} style={styles.addressStyle1}>
                           <Text numberOfLines={1} style={[styles.textStyle, tripdata.selected == 'pickup' ? { fontSize: 18 }:{ fontSize: 14 },{textAlign:isRTL? "right":"left"} ]}>{tripdata.pickup && tripdata.pickup.add ? tripdata.pickup.add : t('map_screen_where_input_text')}</Text>
                       </TouchableOpacity>
                       <TouchableOpacity onPress={() => tapAddress('drop')} style={styles.addressStyle2}>

                           <Text numberOfLines={1} style={[styles.textStyle, tripdata.selected == 'drop' ? { fontSize: 18 }:{ fontSize: 14 },{textAlign:isRTL? "right":"left"} ]}>
                               {tripdata.drop && tripdata.drop.add ? tripdata.drop.add : t('map_screen_drop_input_text')}
                               </Text>
                       </TouchableOpacity>
                   </View>
               </View> */}

          {/* { settings && settings.horizontal_view ?
                   
               <View style={styles.fullCarView}>
                   <ScrollView horizontal={true} style={styles.fullCarScroller} showsHorizontalScrollIndicator={false}>
                       {allCarTypes.map((prop, key) => {
                           return (
                               <View key={key} style={[styles.cabDivStyle, { backgroundColor: prop.active == true ? colors.BOX_BG : colors.WHITE }]}>
                                   <TouchableOpacity onPress={() => { selectCarType(prop, key) }} style={styles.imageStyle}>
                                       <Image resizeMode="contain" source={prop.image ? { uri: prop.image } : require('../../assets/images/microBlackCar.png')} style={styles.imageStyle1} />
                                   </TouchableOpacity>
                                   <View style={[styles.textViewStyle, appcat == 'rentals'?{height:40}:null]}>
                                       <Text style={styles.text1}>{prop.name.toUpperCase()}</Text>
                                       {appcat == 'rentals'?
                                           <View style={{ justifyContent: 'space-around', flexDirection: 'column', alignItems: 'center' }}>
                                               {
                                               prop.extra_info.split(',').map((ln) => <Text style={styles.text2} key={ln} >{ln}</Text>)
                                               }
                                           </View>
                                       :
                                           <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                               {isRTL?
                                                   null:
                                                   settings.swipe_symbol===false?
                                                   <Text style={[styles.text2, { fontWeight: 'bold', color: colors.MAP_TEXT }]}>{settings.symbol}{prop.rate_per_unit_distance} / {settings.convert_to_mile ? t('mile') : t('km')} </Text>
                                                   :
                                                   <Text style={[styles.text2, { fontWeight: 'bold', color: colors.MAP_TEXT }]}>{prop.rate_per_unit_distance}{settings.symbol} / {settings.convert_to_mile ? t('mile') : t('km')} </Text>

                                               }
                                               {
                                                   prop.extra_info && prop.extra_info != '' ?

                                                       <Tooltip style={{ marginLeft: 3, marginRight: 3 }}
                                                           backgroundColor={"#fff"}
                                                           overlayColor={'rgba(50, 50, 50, 0.70)'}
                                                           height={10 + 30 * (prop.extra_info.split(',').length)}
                                                           width={180}
                                                           skipAndroidStatusBar={true}
                                                           popover={
                                                               <View style={{ justifyContent: 'space-around', flexDirection: 'column' }}>
                                                                   {
                                                                       prop.extra_info.split(',').map((ln) => <Text key={ln} >{ln}</Text>)
                                                                   }
                                                               </View>
                                                           }>
                                                           <Icon
                                                               name='information-circle-outline'
                                                               type='ionicon'
                                                               color='#517fa4'
                                                               size={28}
                                                           />
                                                       </Tooltip>

                                                       : null
                                               }
                                               {isRTL?
                                                   settings.swipe_symbol===false?
                                                       <Text style={[styles.text2, { fontWeight: 'bold', color: colors.MAP_TEXT }]}>{settings.symbol}{prop.rate_per_unit_distance} / {settings.convert_to_mile ? t('mile') : t('km')} </Text>
                                                       :
                                                       <Text style={[styles.text2, { fontWeight: 'bold', color: colors.MAP_TEXT }]}>{prop.rate_per_unit_distance}{settings.symbol} / {settings.convert_to_mile ? t('mile') : t('km')} </Text>
                                               :null}

                                           </View>
                                       }
                                       <View style={appcat == 'rentals'?{marginTop:10}:null}>
                                           <Text style={styles.text2}>({prop.minTime != '' ? prop.minTime : t('not_available')})</Text>
                                       </View>
                                   </View>
                               </View>
                           );
                       })}
                   </ScrollView>
               </View>
               :
               <View style={[styles.carShow,{height:25}]}
                   onTouchStart={e => setTouchY(e.nativeEvent.pageY)}
                   onTouchEnd={e => {
                       if ((touchY - e.nativeEvent.pageY > 10) && !isEditing)
                           setIsEditing(!isEditing);
                       if ((e.nativeEvent.pageY - touchY > 10) && isEditing)
                           setIsEditing(!isEditing);
                   }}
               >
                   <View style={[styles.bar, appcat == 'taxi' ? { backgroundColor: colors.BUTTON_YELLOW} : (appcat == 'delivery'? { backgroundColor: colors.BUTTON_ORANGE}: { backgroundColor:colors.RE_GREEN})]} ></View>
               </View>
               } */}

          {/* {isEditing == true && settings && !settings.horizontal_view  ?
                   <View style={[styles.carShow,{ paddingTop: 10, height: 250, alignItems: 'center', flexDirection: 'column', backgroundColor: isEditing == true ? colors.BACKGROUND_PRIMARY : colors.WHITE}]}
                       onTouchStart={e => setTouchY(e.nativeEvent.pageY)}
                       onTouchEnd={e => {
                           if ((touchY - e.nativeEvent.pageY > 10) && !isEditing)
                               setIsEditing(!isEditing);
                           if ((e.nativeEvent.pageY - touchY > 10) && isEditing)
                               setIsEditing(!isEditing);
                       }}
                   >
                   <View style={[styles.bar, appcat == 'taxi' ? { backgroundColor: colors.BUTTON_YELLOW} : (appcat == 'delivery'? { backgroundColor: colors.BUTTON_ORANGE}: { backgroundColor:colors.RE_GREEN})]} ></View>

                       <Animated.View style={{ alignItems: 'center', backgroundColor: colors.BACKGROUND_PRIMARY, flex: animation, paddingTop: 6 }}>
                           <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
                           {allCarTypes.map((prop, key) => {
                               return (
                                   <TouchableOpacity 
                                   style={[styles.carContainer,{ backgroundColor: prop.active == true ? colors.BOX_BG : colors.WHITE}]}
                                   onPress={() => { selectCarType(prop, key) }}
                                   key={key}
                               >
                               <Image
                                   source={prop.image ? { uri: prop.image } : require('../../assets/images/microBlackCar.png')}
                                   resizeMode="contain"
                                   style={styles.cardItemImagePlace}
                               ></Image>
                               <View style={[styles.bodyContent, {alignContent:'center',flexDirection:'column', justifyContent:'center'}]}>
                                   <Text style={styles.titleStyles}>{prop.name.toUpperCase()}</Text>
                                   <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                                   {appcat != 'rentals'?
                                       settings.swipe_symbol===false?
                                           <Text style={[styles.text2, { fontWeight: 'bold', color: colors.MAP_TEXT }]}>{settings.symbol}{prop.rate_per_unit_distance} / {settings.convert_to_mile ? t('mile') : t('km')} </Text>
                                           :
                                           <Text style={[styles.text2, { fontWeight: 'bold', color: colors.MAP_TEXT }]}>{prop.rate_per_unit_distance}{settings.symbol} / {settings.convert_to_mile ? t('mile') : t('km')} </Text>
                                   :null}
                                   { prop.extra_info && prop.extra_info != '' ?
                                       <View style={{ justifyContent: 'space-around',  marginLeft: 3 }}>
                                           {
                                               prop.extra_info.split().map((ln) => <Text key={ln} style={[styles.text2, { fontWeight: 'bold', color: colors.MAP_TEXT }]} >{ln}</Text>)
                                           }
                                       </View>
                                   : null }
                                   </View>
                                   <Text style={styles.text2}>({prop.minTime != '' ? prop.minTime : t('not_available')})</Text>
                               </View>
                               </TouchableOpacity>
                               );
                           })}
                           </ScrollView>
                       </Animated.View>
                   </View>
               :null } */}

          <View style={{}}>
            {/* {allCarTypes.map((prop, key) => (
                  <TouchableOpacity onPress={() => { selectCarType(prop, key) }} style={{backgroundColor: prop.active == true ? colors.BOX_BG : colors.WHITE , elevation:5,borderRadius:10,flexDirection:"row",alignItems:"center",justifyContent:"space-evenly",paddingHorizontal:30,paddingVertical:10,marginHorizontal:30,marginVertical:10}}>
                  <View >
                      <Image  resizeMode="contain" source={prop.image ? { uri: prop.image } : require('../../assets/images/microBlackCar.png')} style={{height:40,width:40,tintColor:colors.primary}}/>
                  </View>
                  <View>
                  <Text style={styles.titleStyles}>{prop.name.toUpperCase()}</Text>
                  </View>
                      </TouchableOpacity>
               ))} */}
            {/* //!original Carlist */}
            {/* {allCarTypes.map((prop, key) => {
                           return (
                               <View key={key} style={[styles.cabDivStyle, { backgroundColor: prop.active == true ? colors.BOX_BG : colors.WHITE }]}>
                                   <TouchableOpacity onPress={() => { selectCarType(prop, key) }} style={styles.imageStyle}>
                                       <Image resizeMode="contain" source={prop.image ? { uri: prop.image } : require('../../assets/images/microBlackCar.png')} style={styles.imageStyle1} />
                                   </TouchableOpacity>
                                   <View style={[styles.textViewStyle, appcat == 'rentals'?{height:40}:null]}>
                                       <Text style={styles.text1}>{prop.name.toUpperCase()}</Text>
                                       {appcat == 'rentals'?
                                           <View style={{ justifyContent: 'space-around', flexDirection: 'column', alignItems: 'center' }}>
                                               {
                                               prop.extra_info.split(',').map((ln) => <Text style={styles.text2} key={ln} >{ln}</Text>)
                                               }
                                           </View>
                                       :
                                           <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                               {isRTL?
                                                   null:
                                                   settings.swipe_symbol===false?
                                                   <Text style={[styles.text2, { fontWeight: 'bold', color: colors.MAP_TEXT }]}>{settings.symbol}{prop.rate_per_unit_distance} / {settings.convert_to_mile ? t('mile') : t('km')} </Text>
                                                   :
                                                   <Text style={[styles.text2, { fontWeight: 'bold', color: colors.MAP_TEXT }]}>{prop.rate_per_unit_distance}{settings.symbol} / {settings.convert_to_mile ? t('mile') : t('km')} </Text>

                                               }
                                               {
                                                   prop.extra_info && prop.extra_info != '' ?

                                                       <Tooltip style={{ marginLeft: 3, marginRight: 3 }}
                                                           backgroundColor={"#fff"}
                                                           overlayColor={'rgba(50, 50, 50, 0.70)'}
                                                           height={10 + 30 * (prop.extra_info.split(',').length)}
                                                           width={180}
                                                           skipAndroidStatusBar={true}
                                                           popover={
                                                               <View style={{ justifyContent: 'space-around', flexDirection: 'column' }}>
                                                                   {
                                                                       prop.extra_info.split(',').map((ln) => <Text key={ln} >{ln}</Text>)
                                                                   }
                                                               </View>
                                                           }>
                                                           <Icon
                                                               name='information-circle-outline'
                                                               type='ionicon'
                                                               color='#517fa4'
                                                               size={28}
                                                           />
                                                       </Tooltip>

                                                       : null
                                               }
                                               {isRTL?
                                                   settings.swipe_symbol===false?
                                                       <Text style={[styles.text2, { fontWeight: 'bold', color: colors.MAP_TEXT }]}>{settings.symbol}{prop.rate_per_unit_distance} / {settings.convert_to_mile ? t('mile') : t('km')} </Text>
                                                       :
                                                       <Text style={[styles.text2, { fontWeight: 'bold', color: colors.MAP_TEXT }]}>{prop.rate_per_unit_distance}{settings.symbol} / {settings.convert_to_mile ? t('mile') : t('km')} </Text>
                                               :null}

                                           </View>
                                       }
                                       <View style={appcat == 'rentals'?{marginTop:10}:null}>
                                           <Text style={styles.text2}>({prop.minTime != '' ? prop.minTime : t('not_available')})</Text>
                                       </View>
                                   </View>
                               </View>
                           );
                       })} */}
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              margin: 30,
            }}
          >
            <CustomButton
              width={"46%"}
              height={verticalScale(40)}
              title={
                (screenName === "Padala" || screenName === "Pabili") && next
                  ? "Back"
                  : "Check Rate"
              }
              fontSize={12}
              // onPress={onPressBookLater}
              onPress={() => {
                if (screenName === "Ride" || screenName === "Car") {
                  onPressBookLater();
                } else {
                  setNext(false);
                }
              }}
              backgroundColor={colors.WHITE}
              borderColor={colors.primary}
              color={colors.primary}
              borderWidth={1}
              fontWeight={"bold"}
            />
            <CustomButton
              width={"46%"}
              height={verticalScale(40)}
              title={
                (screenName === "Padala" || screenName === "Pabili") && !next
                  ? "Next"
                  : "Book Now"
              }
              // onPress={() => {
              //   navigation.navigate("BookPadala");
              // }}
              //?==>
              // onPress={onPressBook}
              onPress={() => {
                if (screenName === "Ride" || screenName === "Car") {
                  onPressBook();
                  console.log(tripdata);
                } else {
                  if (next) {
                    onPressBook();
                    console.log(tripdata);
                  } else {
                    setNext(true);
                    // alert(JSON.stringify(gList))
                  }
                }
              }}
              color={"#1B1B1E"}
              fontSize={12}
              fontWeight={"bold"}
            />
          </View>
          {/* //!original Buttons */}
          {/* <View style={styles.buttonBar}>
                   {bookLoading ?
                   null:
                   <Button
                       title={t('book_later_button')}
                       loading={bookLaterLoading}
                       loadingProps={{ size: "large", color: colors.WHITE }}
                       titleStyle={styles.buttonTitleStyle}
                       onPress={onPressBookLater}
                       buttonStyle={[styles.buttonStyle, { backgroundColor: colors.BUTTON_BACKGROUND ,width:bookLaterLoading?width:width/2}]}
                       containerStyle={[styles.buttonContainer,{width:bookLaterLoading?width:width/2}]}
                   />
                   }
                   <Button
                       title={t('book_now_button')}
                       loading={bookLoading}
                       loadingProps={{ size: "large", color: colors.WHITE }}
                       titleStyle={styles.buttonTitleStyle}
                       onPress={onPressBook}
                       buttonStyle={[styles.buttonStyle, { backgroundColor: appcat == 'taxi' ? colors.BUTTON_YELLOW : (appcat == 'delivery'? colors.BUTTON_ORANGE: colors.RE_GREEN), width:bookLoading?width:width/2 }]}
                       containerStyle={[styles.buttonContainer,{width:bookLoading?width:width/2}]}
                   />
               </View> */}

          {appcat == "delivery" ? (
            <OptionModal
              settings={settings}
              tripdata={tripdata}
              instructionData={instructionData}
              optionModalStatus={optionModalStatus}
              onPressCancel={onModalCancel}
              handleGetEstimate={handleGetEstimate}
              handleParcelTypeSelection={handleParcelTypeSelection}
              handleOptionSelection={handleOptionSelection}
            />
          ) : null}
          {appcat == "rentals" ? (
            <BookingModal
              tripInstructions={tripInstructions}
              setTripInstructions={setTripInstructions}
              roundTrip={roundTrip}
              setRoundTrip={setRoundTrip}
              bookingModalStatus={bookingModalStatus}
              bookNow={bookNow}
              onPressCancel={onModalCancel}
            />
          ) : (
            <BookingModal
              settings={settings}
              tripdata={tripdata}
              estimate={estimatedata.estimate}
              instructionData={instructionData}
              setInstructionData={setInstructionData}
              bookingModalStatus={bookingModalStatus}
              bookNow={bookNow}
              onPressCancel={onModalCancel}
            />
          )}
          <DateTimePickerModal
            date={pickerConfig.selectedDateTime}
            minimumDate={new Date()}
            isVisible={pickerConfig.dateModalOpen}
            mode={pickerConfig.dateMode}
            onConfirm={handleDateConfirm}
            onCancel={hideDatePicker}
          />
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const CarsListCom = ({ name, ...prop }) => (
  <View
    style={{
      backgroundColor: colors.WHITE,
      elevation: 5,
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      paddingHorizontal: 30,
      paddingVertical: 10,
      marginHorizontal: 30,
      marginVertical: 10,
    }}
  >
    <View>
      <Image
        source={
          prop.image
            ? { uri: prop.image }
            : require("../../assets/images/microBlackCar.png")
        }
      />
    </View>
    <View>
      <Text style={styles.titleStyles}>{name.toUpperCase()}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  bottomSheet: {
    position: "absolute",
    bottom: height / 10 - height / 1.5,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: width,
    height: height / 1.5,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  dragHandle: {
    height: 8,
    backgroundColor: "#aaa",
    borderRadius: 10,
    width: 100,
  },
  draggableArea: {
    // backgroundColor:"red",
    height: 50,
    width: width,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  menuIcon: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: colors.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: Platform.OS == "android" ? (__DEV__ ? 20 : 40) : hasNotch ? 40 : 20,
  },
  menuIconButton: {
    flex: 1,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: {
    height: 50,
    width: 180,
    backgroundColor: colors.WHITE,
    shadowColor: colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    justifyContent: "center",
    position: "absolute",
    right: 0,
    top: Platform.OS == "android" ? (__DEV__ ? 20 : 40) : hasNotch ? 40 : 20,
  },
  topTitle1: {
    height: 50,
    width: 180,
    backgroundColor: colors.WHITE,
    shadowColor: colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    justifyContent: "center",
    position: "absolute",
    left: 0,
    top: Platform.OS == "android" ? (__DEV__ ? 20 : 40) : hasNotch ? 40 : 20,
  },
  mapcontainer: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
  },
  mapViewStyle: {
    width: "100%",
    height: "100%",
  },
  mapFloatingPinView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  mapFloatingPin: {
    height: 40,
  },
  buttonBar: {
    height: 60,
    width: width,
    flexDirection: "row",
  },
  buttonContainer: {
    //width: width / 2,
    height: 60,
  },
  buttonStyle: {
    //width: width / 2,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTitleStyle: {
    color: colors.WHITE,
    fontFamily: "Roboto-Bold",
    fontSize: 18,
  },
  locationButtonView: {
    position: "absolute",
    height: Platform.OS == "ios" ? 55 : 42,
    width: Platform.OS == "ios" ? 55 : 42,
    bottom: 180,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: Platform.OS == "ios" ? 30 : 3,
    elevation: 2,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {
      height: 0,
      width: 0,
    },
  },
  locateButtonStyle: {
    height: Platform.OS == "ios" ? 55 : 42,
    width: Platform.OS == "ios" ? 55 : 42,
    alignItems: "center",
    justifyContent: "center",
  },
  addressBar: {
    position: "absolute",
    marginHorizontal: 20,
    top: Platform.OS == "android" ? (__DEV__ ? 80 : 100) : hasNotch ? 100 : 80,
    height: 100,
    width: width - 40,
    flexDirection: "row",
    backgroundColor: colors.WHITE,
    paddingLeft: 10,
    paddingRight: 10,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    borderRadius: 8,
    elevation: 3,
  },
  ballandsquare: {
    width: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  hbox1: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: colors.GREEN_DOT,
  },
  hbox2: {
    height: 36,
    width: 1,
    backgroundColor: colors.MAP_TEXT,
  },
  hbox3: {
    height: 12,
    width: 12,
    backgroundColor: colors.DULL_RED,
  },
  contentStyle: {
    justifyContent: "center",
    width: width - 74,
    height: 100,
  },
  addressStyle1: {
    borderBottomColor: colors.BLACK,
    borderBottomWidth: 1,
    height: 48,
    width: width - 84,
    justifyContent: "center",
    paddingTop: 2,
  },
  addressStyle2: {
    height: 48,
    width: width - 84,
    justifyContent: "center",
  },
  textStyle: {
    fontFamily: "Roboto-Regular",
    fontSize: 14,
    color: "#000",
  },
  fullCarView: {
    position: "absolute",
    bottom: 60,
    width: width - 10,
    height: 170,
    marginLeft: 5,
    marginRight: 5,
    alignItems: "center",
  },
  fullCarScroller: {
    width: width - 10,
    height: 160,
    flexDirection: "row",
  },
  cabDivStyle: {
    backgroundColor: colors.WHITE,
    width: (width - 40) / 3,
    height: "95%",
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    borderRadius: 8,
    elevation: 3,
  },
  imageStyle: {
    height: 50,
    width: "100%",
    marginVertical: 20,
    padding: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 5,
  },
  imageStyle1: {
    height: 40,
    width: 50 * 1.8,
  },
  textViewStyle: {
    height: 50,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  text1: {
    fontFamily: "Roboto-Bold",
    fontSize: 14,
    fontWeight: "900",
    color: colors.BLACK,
  },
  text2: {
    fontFamily: "Roboto-Regular",
    fontSize: 10,
    fontWeight: "900",
    color: colors.BORDER_TEXT,
  },
  carShow: {
    width: "100%",
    justifyContent: "center",
    backgroundColor: colors.BACKGROUND_PRIMARY,
    position: "absolute",
    bottom: 60,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: "center",
  },
  bar: {
    width: 100,
    height: 6,
  },

  carContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width - 30,
    height: 70,
    marginBottom: 5,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: colors.WHITE,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.BORDER_BACKGROUND,
    elevation: 3,
  },
  bodyContent: {
    flex: 1,
  },
  titleStyles: {
    fontSize: 14,
    color: colors.HEADER,
    paddingBottom: 2,
    fontWeight: "bold",
    // textAlign: "center",
  },
  subtitleStyle: {
    fontSize: 12,
    color: colors.BALANCE_ADD,
    lineHeight: 16,
    paddingBottom: 2,
  },
  priceStyle: {
    color: colors.BALANCE_ADD,
    fontWeight: "bold",
    fontSize: 12,
    lineHeight: 14,
  },
  cardItemImagePlace: {
    width: 60,
    height: 50,
    margin: 10,
    borderRadius: 5,
  },
  checkContainer: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.FOOTERTOP,
    alignItems: "center",
    justifyContent: "center",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
