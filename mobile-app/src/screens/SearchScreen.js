import React, { useState, useContext, useEffect } from "react";
import { Header, Icon } from "react-native-elements";
import { colors } from "../common/theme";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  ActivityIndicator,
  Alert,
  Keyboard,
  Image,
} from "react-native";
import i18n from "i18n-js";
import { FirebaseContext } from "common/src";
import { useSelector, useDispatch } from "react-redux";
import { Spacer } from "../components/Spacer";
import { AntDesign, FontAwesome, Feather, Entypo } from "react-native-vector-icons";
import { images } from "../../assets/images";

var { height, width } = Dimensions.get("window");

export default function SearchScreen(props) {
  const { api, appcat } = useContext(FirebaseContext);
  const { t } = i18n;
  const isRTL =
    i18n.locale.indexOf("he") === 0 || i18n.locale.indexOf("ar") === 0;
  const {
    fetchCoordsfromPlace,
    fetchPlacesAutocomplete,
    updateTripPickup,
    updateTripDrop,
  } = api;
  const dispatch = useDispatch();
  const [searchResults, setSearchResults] = useState([]);
  const [isShowingResults, setIsShowingResults] = useState(false);
  const tripdata = useSelector((state) => state.tripdata);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const { locationType, addParam } = props.route.params;
  const [loading, setLoading] = useState();
  const settingsdata = useSelector((state) => state.settingsdata.settings);
  const [settings, setSettings] = useState({});
  const [selLocations, setSelLocations] = useState([]);

  useEffect(() => {
    if (settingsdata) {
      setSettings(settingsdata);
    }
  }, [settingsdata]);
  useEffect(() => {
    if (addParam.length <= 5) {
      setSavedAddresses(addParam);
    } else {
      setSavedAddresses(addParam.sort((a, b) => a.count < b.count).slice(0, 5));
    }
  }, []);

  useEffect(() => {
    if (tripdata.drop && locationType == "drop") {
      let arr = [];
      if (tripdata.drop && tripdata.drop.waypoints) {
        const waypoints = tripdata.drop.waypoints;
        for (let i = 0; i < waypoints.length; i++) {
          arr.push(waypoints[i]);
        }
      }
      if (tripdata.drop.add) {
        arr.push({
          lat: tripdata.drop.lat,
          lng: tripdata.drop.lng,
          add: tripdata.drop.add,
          source: tripdata.drop.source,
        });
      }
      setSelLocations(arr);
    }
  }, [locationType, tripdata.drop]);

  const searchLocation = async (text) => {
    setSearchKeyword(text);
    if (text.length > (settings.AllowCriticalEditsAdmin ? 3 : 5)) {
      const res = await fetchPlacesAutocomplete(text);
      if (res) {
        setSearchResults(res);
        setIsShowingResults(true);
      }
    }
  };

  const updateLocation = (data) => {
    setLoading(true);
    appcat == "taxi"
      ? setSearchKeyword("")
      : setSearchKeyword(data.description);
    setIsShowingResults(false);
    if (data.place_id) {
      fetchCoordsfromPlace(data.place_id).then((res) => {
        if (res && res.lat) {
          if (locationType == "pickup") {
            dispatch(
              updateTripPickup({
                lat: res.lat,
                lng: res.lng,
                add: data.description,
                source: "search",
              })
            );
            if (appcat == "taxi" || appcat == "rentals") {
              props.navigation.pop();
            }
          } else {
            if (appcat == "taxi") {
              let arr = selLocations;
              arr.push({
                lat: res.lat,
                lng: res.lng,
                add: data.description,
                source: "search",
              });
              Keyboard.dismiss();
              setSelLocations(arr);
            } else {
              dispatch(
                updateTripDrop({
                  lat: res.lat,
                  lng: res.lng,
                  add: data.description,
                  source: "search",
                })
              );
            }
          }
          setLoading(false);
          if (appcat == "delivery") {
            props.navigation.pop();
          }
        } else {
          Alert.alert(t("alert"), t("place_to_coords_error"));
        }
      });
    } else {
      if (data.description) {
        if (locationType == "pickup") {
          dispatch(
            updateTripPickup({
              lat: data.lat,
              lng: data.lng,
              add: data.description,
              source: "search",
            })
          );
          if (appcat == "taxi" || appcat == "rentals") {
            props.navigation.pop();
          }
        } else {
          if (appcat == "taxi") {
            let arr = [...selLocations];
            let notFound = true;
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].add == data.description) {
                notFound = false;
                break;
              }
            }
            if (notFound) {
              let entry = {
                lat: data.lat,
                lng: data.lng,
                add: data.description,
                source: "search",
              };
              arr.push(entry);
            }
            Keyboard.dismiss();
            setSelLocations(arr);
          } else {
            dispatch(
              updateTripDrop({
                lat: data.lat,
                lng: data.lng,
                add: data.description,
                source: "search",
              })
            );
          }
        }
        setLoading(false);
        if (appcat == "delivery") {
          props.navigation.pop();
        }
      }
    }
  };

  const okClicked = () => {
    let waypoints = [...selLocations];
    waypoints.splice(selLocations.length - 1, 1);
    let dropObj = {
      ...selLocations[selLocations.length - 1],
      waypoints: waypoints,
    };
    dispatch(updateTripDrop(dropObj));
    props.navigation.pop();
  };

  const removeItem = (index) => {
    let arr = [...selLocations];
    arr.splice(index, 1);
    setSelLocations(arr);
  };

  const lCom = {
    icon: "angle-left",
    type: "font-awesome",
    color: colors.WHITE,
    size: 35,
    component: TouchableWithoutFeedback,
    onPress: () => {
      props.navigation.goBack();
    },
  };
  const rCom = {
    icon: "angle-right",
    type: "font-awesome",
    color: colors.WHITE,
    size: 35,
    component: TouchableWithoutFeedback,
    onPress: () => {
      props.navigation.goBack();
    },
  };
  const okCom = (
    <TouchableOpacity onPress={okClicked}>
      <Text
        style={[styles.headerTitleStyle, { color: colors.DRIVER_TRIPS_BUTTON }]}
      >
        {t("ok")}
      </Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.mainView}>
      {/* <Header
              backgroundColor={colors.WHITE}
              leftComponent={isRTL? (selLocations.length> 0 && locationType=='drop')?okCom:null:lCom}
              centerComponent={<Text style={styles.WHITETitleStyle}>{t('search')}</Text>}
              rightComponent={isRTL? rCom: (selLocations.length > 0 && locationType=='drop')? okCom : null}
              containerStyle={styles.headerStyle}
          /> */}
      <Spacer height={30} />
      <View style={{ backgroundColor: colors.WHITE }}>
        {selLocations.length > 0 ? (
          <FlatList
            data={selLocations}
            renderItem={({ item, index }) => {
              return (
                <View
                  key={"key" + index}
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    marginVertical: 10,
                  }}
                >
                  {/* <Text
                    style={{
                      paddingLeft: 10,
                      width: width - 40,
                      fontSize: 18,
                      color: colors.SEARCH_TEXT,
                      paddingTop: 6,
                      paddingBottom: 6,
                    }}
                    numberOfLines={1}
                  >
                    {item.add}
                  </Text> */}
                  {/* <TouchableOpacity
                    style={{ paddingLeft: 0 }}
                    onPress={() => removeItem(index)}
                  >
                    <Image
                      source={require("../../assets/images/cross.png")}
                      style={{ height: 30, width: 30 }}
                    />
                  </TouchableOpacity> */}
                </View>
              );
            }}
            keyExtractor={(item) => item.add}
            style={styles.multiLocation}
          />
        ) : null}
        <View
          style={[
            styles.autocompleteMain,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          {/* <FontAwesomeIcon icon="fa-solid fa-chevron-left" /> */}
          <TouchableOpacity onPress={()=> props.navigation.goBack()} >
          <Feather
            name="chevron-left"
            // type='Feather'
            color={colors.HEADER}
            size={22}
            style={[isRTL ? { left: 0, right: 5 } : { left: 5, right: 0 }]}
          />
          </TouchableOpacity>
          
          <Spacer width={10} />
          <Feather name="circle" size={12} color={colors.BUTTON_ORANGE} />

          <TextInput
            placeholder={t("search_for_an_address")}
            returnKeyType="search"
            style={[
              styles.searchBox,
              isRTL
                ? { paddingRight: 10, textAlign: "right" }
                : { paddingLeft: 10, textAlign: "left" },
            ]}
            placeholderTextColor="#000"
            onChangeText={(text) => searchLocation(text)}
            value={searchKeyword}
          />
           <TouchableOpacity onPress={()=> {setSearchKeyword(""); setSearchResults(()=> savedAddresses), console.log(savedAddresses)}} >
          <Entypo name="circle-with-cross"size={18} color={colors.grayBorder} />
         </TouchableOpacity> 
        </View>
        {/* <TouchableOpacity onPress={()=> setSearchKeyword("")} >
        <View><Text>dfsjd</Text></View>
        </TouchableOpacity> */}
        {isShowingResults || savedAddresses ? (
          <FlatList
            keyboardShouldPersistTaps="always"
            data={isShowingResults ? searchResults : savedAddresses  }
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  key={item.description}
                  style={styles.resultItem}
                  onPress={() => updateLocation(item)}
                >
                  <View style={{display:"flex", flexDirection:"row",alignItems:'center'}} >
                    <Image
                      source={images.location1}
                      style={{ height: 20, width: 20,tintColor:"#aaa" }}
                    />
                    {/* <Feather name="circle" size={12} color={colors.grayBorder} /> */}
                    <Spacer width={10} />
                    <View>
                    <Text numberOfLines={1} style={{...styles.description,fontSize:14,fontWeight:"600"}}>
                      {item.description.split(",")[0] }
                    </Text>
                    <Text numberOfLines={1} style={{...styles.description,color:'#aaa',fontSize:12}}>
                      {item.description.split(",")[0] + "," + item.description.split(",")[1] + "," + item.description.split(",")[2] + "," + item.description.split(",")[2]}
                    </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            // keyExtractor={(item) => item.description}
            style={styles.searchResultsContainer}
          />
        ) : null}
      </View>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.BLACK} size="large" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    // backgroundColor: colors.HEADER,
    backgroundColor: colors.WHITE,
  },
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
  autocompleteMain: {
    // width:"80%",
    backgroundColor: "#fff",
    height: 60,
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  searchBox: {
    width: "80%",
    height: 50,
    fontSize: 14,
    borderColor: "#ccc",
    color: "#000",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  description: {
    color: colors.BLACK,
    textAlign: "left",
    fontSize: 18,
  },
  resultItem: {
    width: "100%",
    paddingHorizontal:5,
    justifyContent: "center",
    paddingVertical: 15,
    borderBottomColor: "#ccc",
    borderBottomWidth: 0.8,
    // backgroundColor: colors.HEADER,
    backgroundColor: colors.WHITE,
    alignItems: "flex-start",
  },
  searchResultsContainer: {
    width: "100%",
    paddingHorizontal: 15,
  },
  headerStyle: {
    // backgroundColor: colors.HEADER,
    backgroundColor: colors.WHITE,
    borderBottomWidth: 0,
  },
  headerTitleStyle: {
    color: colors.WHITE,
    fontFamily: "Roboto-Bold",
    fontSize: 20,
  },
  multiLocation: {
    marginTop: 10,
  },
});
