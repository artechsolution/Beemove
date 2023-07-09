import React, { useEffect,useState } from 'react';
import { RideList } from '../components';
import {
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback,
    Platform,
    Dimensions,
    Image,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { Header } from 'react-native-elements';
import { colors } from '../common/theme';
import i18n from 'i18n-js';
import { useSelector } from 'react-redux';
import { DrawerActions } from '@react-navigation/native';
import MyBookings from './Main/MyBookings/MyBookings';
import { Spacer } from '../components/Spacer';
import commonStyles from '../../Utils/CommonStyles';
import CustomHeader from '../components/CustomHeader';
import { TouchableOpacity } from 'react-native';
import { AntDesign, Feather, Octicons,MaterialIcons } from "@expo/vector-icons";
import CustomText from '../components/CustomText';
import { images } from '../../assets/images';

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
 

export default function RideListPage(props) {
    const bookings = useSelector(state => state.bookinglistdata.bookings);
    const settings = useSelector(state => state.settingsdata.settings);
    const fromBooking  = props.route.params?props.route.params: null;
    const [bookingData,setBookingData] = useState([]);
    const { t } = i18n;
    const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;
    const [tabIndex, setTabIndex] = useState(-1);

    useEffect(()=>{
        if(bookings){
            setBookingData(bookings);
            if(fromBooking){
                const lastStatus = bookings[0].status;
                if(lastStatus == 'COMPLETE') setTabIndex(1);
                if(lastStatus == 'CANCELLED') setTabIndex(2);
            }else{
                setTabIndex(0);
            }
        }else{
            setBookingData([]);
            setTabIndex(0);
        }
    },[bookings]);

    const goDetails = (item, index) => {
        if (item && item.trip_cost > 0) {
            item.roundoffCost = Math.round(item.trip_cost).toFixed(settings.decimal);
            item.roundoff = (Math.round(item.roundoffCost) - item.trip_cost).toFixed(settings.decimal);
            props.navigation.push('RideDetails', { data: item });
        } else {
            item.roundoffCost = Math.round(item.estimate).toFixed(settings.decimal);
            item.roundoff = (Math.round(item.roundoffCost) - item.estimate).toFixed(settings.decimal);
            props.navigation.push('RideDetails', { data: item });
        }
    }

    const hCom ={ icon: 'md-menu', type: 'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback, onPress: () => { props.navigation.dispatch(DrawerActions.toggleDrawer()); } };
    

   

    return (
        
       
        <SafeAreaView style={styles.mainView}>
            {/* <Header
                backgroundColor={colors.HEADER}
                leftComponent={isRTL? null:hCom}
                centerComponent={<Text style={styles.headerTitleStyle}>{t('ride_list_title')}</Text>}
                rightComponent={isRTL? hCom:null}
                containerStyle={styles.headerStyle}
                innerContainerStyles={{ marginLeft: 10, marginRight: 10 }}
            /> */}
            {/* <Spacer height={Platform.OS==='ios'?40:30}/> */}
            <StatusBar hidden={false}/>
              <Spacer height={Platform.OS=="android"? 30:0}/>
            <View
            style={{
              paddingVertical: 10,
              justifyContent: "center",
              width: screenWidth,
              paddingHorizontal: 15,
            }}
            >
                <Spacer height={Platform.OS=="android"? 20:0}/>
            <CustomHeader
               LeftSide={() => (
           
            
                <TouchableOpacity
                activeOpacity={0.6}
                onPress={ () => { props.navigation.dispatch(DrawerActions.toggleDrawer()); }}
                style={commonStyles.iconContainer}>
                  <Image
                    resizeMode="contain"
                    source={images.sort}
                    style={commonStyles.img}
                  />
                </TouchableOpacity>
              )}
            
       
              Center={() => (
                <View style={{flexDirection:'row',alignItems:"center",marginLeft:"-10%"}}>
                <MaterialIcons name="work" color={'#F6AD00'} size={20}/>
                <Spacer width={10}/>
                <CustomText
                  label="My Booking"
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
            {/* <MyBookings/> */}
            {/* <Card /> */}
            {/* {tabIndex>=0?
                <Card onPressButton={(item, index) => { goDetails(item, index) }} data={bookingData} tabIndex={tabIndex}></Card>
            :null} */}
            {tabIndex>=0?
                <RideList onPressButton={(item, index) => { goDetails(item, index) }} data={bookingData} tabIndex={tabIndex}></RideList>
            :null}
        </SafeAreaView>
      

    );

}

const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: colors.HEADER,
        borderBottomWidth: 0
    },
    headerTitleStyle: {
        color: colors.WHITE,
        fontFamily: 'Roboto-Bold',
        fontSize: 20
    },
    containerView: { flex: 1 },
    textContainer: { textAlign: "center" },
    mainView: {
        flex: 1,
        backgroundColor: colors.WHITE
    }
});
