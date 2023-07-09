import { View, Text,Image } from 'react-native'
import React from 'react'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
 

const LoginRegHeader = () => {
  return (
    <View style={{width:"110%",height:"50%",marginLeft:verticalScale(-25)}} >
    <Image
    resizeMode="contain"
    style={{width:"100%",height:"100%"}}
     source={require("../../../../../assets/images/traffic.png")}/>

</View>
  )
}

export default LoginRegHeader