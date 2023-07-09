import React from 'react';
import { Text, View, Image,TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Icon } from 'react-native-elements'
import { colors } from '../../Utils/Colors';
import i18n from 'i18n-js';
import { Spacer } from './Spacer';
//make a compontent
const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;

const SideMenuHeader = ({headerStyle,userPhoto,userName,userEmail,language}) =>{
   return (
        <View style={[styles.viewStyle,headerStyle]}>
            <Spacer height={Platform.OS=="android"? 20:0}/>
            <TouchableOpacity style={styles.userImageView} >
                 <Image 
                    source={userPhoto == null?require('../../assets/images/profilePic.png'):{uri:userPhoto}}
                    style={styles.imageStyle}
                />
            </TouchableOpacity>   
            <View style={styles.headerTextStyle}>
                <Text style={styles.ProfileNameStyle}>{userName?userName.toUpperCase():""}</Text>
            </View>
            <View style={[styles.iconViewStyle,{flexDirection: language != null && language == 'ar'?'row-reverse':'row'}]}>
                <Icon 
                    name='mail-outline'
                    type='ionicons'
                    color={colors.BLACK}
                    size={16}
                />
                <Text style={[styles.emailStyle,language != null && language == 'ar'?{marginRight: 4}:{marginLeft: 4}]}>{userEmail?userEmail.toLowerCase():""}</Text>
            </View>
            <Spacer height={10}/>
            <View style={{width:"100%",height:2,backgroundColor:colors.primary}}></View>
        </View>
   );
 
};

const styles = {
    viewStyle:{
        // backgroundColor:colors.b,
        justifyContent:'center',
        alignItems:'center',
        // height:180,
        paddingTop:Platform.OS=='ios'?50:StatusBar.currentHeight,
        shadowColor:colors.black,
        shadowOffset:{width:0,height:2},
        shadowOpacity:0.2,
        elevation:2,
        position:'relative',
        flexDirection:'column'
    },
    textStyle:{
        fontSize:20,
        color:colors.black
    },
    headerTextStyle:{
        justifyContent:'center',
        alignItems: 'center',
        marginTop: 10
    },
    iconStyle:{
       
    },
    userImageView: {
        width: 84,
        height: 84,
        borderRadius: 50,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor:colors.lightBlack,
        justifyContent: 'center',
        alignItems: 'center',
        // padding: 20
    },
    ProfileNameStyle:{
        fontWeight: 'bold', 
        color: colors.black, 
        fontSize: 15
    },
    iconViewStyle:{
        width:220,
        justifyContent: 'center', 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: 4
    },
    emailStyle:{
        color: colors.black, 
        fontSize: 13,
        marginLeft: 4,
        textAlign:'center'
    },
    imageStyle:{
        width: 78, 
        height:78,
        borderRadius:99
        
        
    }
}
//make the component available to other parts of the app
export default SideMenuHeader;