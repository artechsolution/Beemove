import React, { useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Icon } from "react-native-elements";
import { colors } from "../common/theme";
import i18n from "i18n-js";
import { useSelector } from "react-redux";
import SegmentedControlTab from "react-native-segmented-control-tab";
import moment from "moment/min/moment-with-locales";
import { FirebaseContext } from "common/src";
import MyBookings from "../screens/Main/MyBookings/MyBookings";
import { Spacer } from "../components/Spacer";
import commonStyles from "../../Utils/CommonStyles";
import CustomHeader from "../components/CustomHeader";
// import { TouchableOpacity } from 'react-native';
import {
  AntDesign,
  Feather,
  Octicons,
  MaterialIcons,
} from "@expo/vector-icons";
import CustomText from "../components/CustomText";
import { images } from "../../assets/images";

export default function RideList(props) {
  const { t } = i18n;
  const isRTL =
    i18n.locale.indexOf("he") === 0 || i18n.locale.indexOf("ar") === 0;
  const { appcat } = useContext(FirebaseContext);

  const settings = useSelector((state) => state.settingsdata.settings);
  const [tabIndex, setTabIndex] = useState(props.tabIndex);

  const onPressButton = (item, index) => {
    props.onPressButton(item, index);
  };

  const renderData = ({ item, index }) => {
    return (
        <TouchableOpacity style={[styles.iconClickStyle,{flexDirection:isRTL?'row-reverse':'row',marginLeft:10}]} onPress={() => onPressButton(item, index)}>
            <View style={styles.iconViewStyle}>
                {appcat=='delivery'?
                <Icon
                    name='truck-fast'
                    type='material-community'
                    color={colors.BLACK}
                    size={35}
                />
                :
                <Icon
                    name='car-sports'
                    type='material-community'
                    color={colors.HEADER}
                    size={35}
                />
                }
            </View>
            <View style={[styles.flexViewStyle, isRTL?{flexDirection:'row-reverse',marginRight: 5}:{flexDirection:'row',marginLeft: 5}]}>
                <View style={styles.textView1}>

                    <Text style={[styles.textStyle, styles.dateStyle,{textAlign:isRTL? "right":"left"}]}>{item.bookingDate ? moment(item.bookingDate).format('lll') : ''}</Text>
                    <View style={[isRTL?{flexDirection:'row-reverse'}:{flexDirection:'row'}]}> 
                        <Text style={[styles.textStyle, styles.carNoStyle,{textAlign:isRTL? "right":"left"}]}> {isRTL? '-': null} {item.carType ? item.carType : null} {isRTL? null : '- '}</Text>
                        <Text style={[styles.textStyle, styles.carNoStyle,{textAlign:isRTL? "right":"left"}]}>{item.vehicle_number ? item.vehicle_number : t('no_car_assign_text')}</Text>
                    </View>
                    <View style={[styles.picupStyle, styles.position,{flexDirection:isRTL?'row-reverse':'row'}]}>

                        <View style={styles.greenDot} />
                        <Text style={[styles.picPlaceStyle, styles.placeStyle, isRTL?{textAlign:"right",marginRight:10}:{textAlign:"left",marginLeft:10}]}>{item.pickup ? item.pickup.add : t('not_found_text')}</Text>
                    </View>
                    <View style={[styles.dropStyle, styles.textViewStyle,{flexDirection:isRTL?'row-reverse':'row'}]}>
                        <View style={[styles.redDot, styles.textPosition]} />
                        <Text style={[styles.dropPlaceStyle, styles.placeStyle, isRTL?{textAlign:"right",marginRight:10}:{textAlign:"left",marginLeft:10}]}>{item.drop ? item.drop.add : t('not_found_text')}</Text>
                    </View>

                </View>
                <View style={styles.textView2}>
                    <Text style={[styles.fareStyle, styles.dateStyle,{textAlign:isRTL? "right":"left"}]}>{item.status == 'NEW' || item.status == 'PAYMENT_PENDING'? t(item.status) : null}</Text>
                    {settings.swipe_symbol===false?
                        <Text style={[styles.fareStyle, styles.dateStyle,{textAlign:isRTL? "right":"left"}]}>{item.status == 'PAID' || item.status == 'COMPLETE'? item.customer_paid ? settings.symbol + parseFloat(item.customer_paid).toFixed(settings.decimal) : settings.symbol + parseFloat(item.estimate).toFixed(settings.decimal) : null}</Text>
                        :
                        <Text style={[styles.fareStyle, styles.dateStyle,{textAlign:isRTL? "right":"left"}]}>{item.status == 'PAID' || item.status == 'COMPLETE'? item.customer_paid ? parseFloat(item.customer_paid).toFixed(settings.decimal) + settings.symbol  : parseFloat(item.estimate).toFixed(settings.decimal) + settings.symbol : null}</Text>
                    }
                    {
                        item.status == 'CANCELLED' ?
                            <Image
                                style={[styles.cancelImageStyle, isRTL?{marginLeft:20, alignSelf: 'flex-start'}:{marginRight: 20, alignSelf: 'flex-end'}]}
                                source={require('../../assets/images/cancel.png')}
                            />
                            :
                            null
                    }
                </View>
            </View>
        </TouchableOpacity>
            
    )
}

  const BlurCircle = () => (
    <View
      style={{
        borderRadius: 30,
        borderWidth: 2,
        borderColor: "#8EB4FF",
        padding: 2,
        width: 18,
          height: 18,
          justifyContent:"center",
          alignItems:"center"
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

  const renderMyCard = ({ item, index }) => (
    <TouchableOpacity
    activeOpacity={0.7}
      onPress={() => onPressButton(item, index)}
      style={{
        marginHorizontal: 30,
        backgroundColor: colors.WHITE,
        marginTop: 40,
        elevation: 5,
        padding: 10,
        borderRadius: 10,
        shadowColor: Platform.OS == "ios" ? "#ced4da" : colors.BLACK,
        shadowRadius: 5,
        elevation: 5,
        // alignItems: "center",
        shadowOpacity: 0.3,

        shadowOffset: { width: 2, height: 2 },
      }}
    >
      <View
        style={{
          height: 60,
          width: 60,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 20,
          backgroundColor: colors.WHITE,
          borderWidth: 0.5,
          borderColor: "#BFBFBF",
          elevation: 5,
          position: "absolute",
          top: -20,
          left: -20,
        }}
      >
        {appcat == "delivery" ? (
          <Icon
            name="truck-fast"
            type="material-community"
            color={colors.primary}
            size={35}
          />
        ) : (
          <Icon
            name="car-sports"
            type="material-community"
            color={colors.primary}
            size={35}
          />
        )}
      </View>
      {/* Card Body */}
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            // alignItems: "center",
            paddingLeft: 40,
          }}
        >
          <View>
            <CustomText label={item.bookingDate ? moment(item.bookingDate).format("lll") : ""} fontSize={12} />
            <View style={{flexDirection:"row"}}>

            <CustomText label={`${item.carType ? item.carType : null} ${isRTL? null : '- '}`} fontSize={12} />
            <CustomText label={item.vehicle_number ? item.vehicle_number : t('no_car_assign_text')} fontSize={12} />
            </View>
          </View>
          <View>
          <Text >{item.status == 'NEW' || item.status == 'PAYMENT_PENDING'? t(item.status) : null}</Text>
                    {settings.swipe_symbol===false?
                        <Text style={[styles.fareStyle, styles.dateStyle,{textAlign:isRTL? "right":"left"}]}>{item.status == 'PAID' || item.status == 'COMPLETE'? item.customer_paid ? settings.symbol + parseFloat(item.customer_paid).toFixed(settings.decimal) : settings.symbol + parseFloat(item.estimate).toFixed(settings.decimal) : null}</Text>
                        :
                        <Text style={[styles.fareStyle, styles.dateStyle,{textAlign:isRTL? "right":"left"}]}>{item.status == 'PAID' || item.status == 'COMPLETE'? item.customer_paid ? parseFloat(item.customer_paid).toFixed(settings.decimal) + settings.symbol  : parseFloat(item.estimate).toFixed(settings.decimal) + settings.symbol : null}</Text>
                    }
                    {
                        item.status == 'CANCELLED' ?
                            <Image
                                style={[styles.cancelImageStyle, isRTL?{marginLeft:20, alignSelf: 'flex-start'}:{marginRight: 20, alignSelf: 'flex-end'}]}
                                source={require('../../assets/images/cancel.png')}
                            />
                            :
                            null
                    }
          </View>
        </View>
        <Spacer height={20} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{flex:1,}}>
            <BlurCircle />
          </View>
          <View style={{flex:9,}}>
            <CustomText
              label={item.pickup ? item.pickup.add : t('not_found_text')}
              fontSize={10}
              color={colors.darkGray}
            />
          </View>
        </View>
        <Spacer height={10} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ height: 30, width: 30,flex:1, }}>
            <Image
              source={require("../../assets/images/location.png")}
              style={{ height: 20, width: 20 }}
              resizeMode={"contain"}
            />
          </View>
          <View style={{flex:9}}>
            <CustomText
              label={item.drop ? item.drop.add : t('not_found_text')}
              fontSize={10}
              color={colors.darkGray}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <>
      <View style={styles.textView3}>
        <SegmentedControlTab
          values={[t("active_booking"), t("COMPLETE"), t("CANCELLED")]}
          selectedIndex={tabIndex}
          onTabPress={(index) => setTabIndex(index)}
          borderRadius={0}
          tabsContainerStyle={styles.segmentcontrol}
          tabStyle={{
            borderWidth: 0,
            backgroundColor: "transparent",
            borderBottomWidth: 1,
            marginLeft:5,
            marginRight:5,
            borderBottomColor: colors.BACKGROUND_PRIMARY,
          }}
          activeTabStyle={{
            borderBottomColor: colors.BACKGROUND,
            backgroundColor: "transparent",
            borderBottomWidth: 2,
          }}
          tabTextStyle={{ color: colors.RIDELIST_TEXT, fontWeight: "bold",fontSize:14 }}
          activeTabTextStyle={{ color: colors.BACKGROUND }}
        />
        
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={
            tabIndex === 0
              ? props.data.filter(
                  (item) =>
                    !(item.status === "CANCELLED" || item.status === "COMPLETE")
                )
              : tabIndex === 1
              ? props.data.filter((item) => item.status === "COMPLETE")
              : props.data.filter((item) => item.status === "CANCELLED")
          }
          renderItem={renderMyCard}
        ListFooterComponent={()=><Spacer height={100}/>}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 18,
  },
  fareStyle: {
    fontSize: 18,
  },
  // carNoStyle: {
  //     marginLeft: 45,
  //     fontSize: 13,
  //     marginTop: 10
  // },
  picupStyle: {
    flexDirection: "row",
  },
  picPlaceStyle: {
    color: colors.RIDELIST_TEXT,
  },
  dropStyle: {
    flexDirection: "row",
  },
  drpIconStyle: {
    color: colors.RED,
    fontSize: 20,
  },
  dropPlaceStyle: {
    color: colors.RIDELIST_TEXT,
  },
  greenDot: {
    alignSelf: "center",
    borderRadius: 10,
    width: 10,
    height: 10,
    backgroundColor: colors.GREEN_DOT,
  },
  redDot: {
    borderRadius: 10,
    width: 10,
    height: 10,
    backgroundColor: colors.RED,
  },
  logoStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconClickStyle: {
    flex: 1,
  },
  flexViewStyle: {
    flex: 7,
    flexDirection: "row",
    borderBottomColor: colors.RIDELIST_TEXT,
    borderBottomWidth: 1,
    marginTop: 10,
  },
  dateStyle: {
    fontFamily: "Roboto-Bold",
    color: colors.HEADER,
  },
  carNoStyle: {
    fontFamily: "Roboto-Regular",
    fontSize: 14,
    marginTop: 8,
    color: colors.HEADER,
  },
  placeStyle: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    alignSelf: "center",
  },
  textViewStyle: {
    marginTop: 10,
    marginBottom: 10,
  },
  cancelImageStyle: {
    width: 50,
    height: 50,
    marginTop: 18,
  },
  iconViewStyle: {
    flex: 1,
    marginTop: 10,
  },
  textView1: {
    flex: 5,
  },
  textView2: {
    flex: 2,
  },
  textView3: {
    flex: 1,
  },
  position: {
    marginTop: 20,
  },
  textPosition: {
    alignSelf: "center",
  },
  segmentcontrol: {
    color: colors.WHITE,
    fontSize: 18,
    fontFamily: "Roboto-Regular",
    marginTop: 0,
    alignSelf: "center",
    height: 50,
  },
});
