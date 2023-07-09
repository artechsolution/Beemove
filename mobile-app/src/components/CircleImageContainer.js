import { StyleSheet, Text, View,Image } from 'react-native'
import React from 'react'
import { colors } from '../../Utils/Colors'
import { images } from '../../assets/images'

const CircleImageContainer = () => {
  return (
    <View style={styles.mainContainer}>
        <Image  style={{width:80,height:80}} resizeMode="contain" source={images.profilePic} />
    </View>
  )
}

export default CircleImageContainer

const styles = StyleSheet.create({
    mainContainer:{
        width:90,
        height:90,
        borderRadius:99,
        borderColor:colors.grayBorder,
        borderWidth:1.5,
        alignItems:"center",
        justifyContent:"center"


    }

})