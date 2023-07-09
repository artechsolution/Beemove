import { StyleSheet, Text, View,Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { scale, verticalScale } from 'react-native-size-matters'
import commonStyles from '../../../../../Utils/CommonStyles'
import { Spacer } from '../../../../components/Spacer'
import CustomText from '../../../../components/CustomText'
import { colors } from '../../../../../Utils/Colors'

const BookRideContainer = ({item}) => {
  return (
    <TouchableOpacity 
    onPress={item?.onPress}
    style={styles.mainContainer}>
        <View style={{width: item.imgWidth|| 30,height: item.imgHeigth ||30}}>
            <Image  resizeMode="contain" style={commonStyles.img} source={item?.img}/>

        </View>
        <Spacer width={20}/>
        <View>
        <CustomText
          label={item?.txt1}
          color={colors.lightText}
          fontSize={13}
          fontFamily="Roboto-Bold"
          
        />
        <CustomText
          label={item?.txt2}
          color={colors.lightText}
          fontSize={10}
          fontFamily="Roboto-Light"
          marginTop={2}
        />

        </View>
    </TouchableOpacity>
  )
}

export default BookRideContainer

const styles = StyleSheet.create({
    mainContainer:{
        flexDirection:"row",
        alignItems:"center",
        height:verticalScale(55),
        backgroundColor:colors.white,
        borderRadius:5,
        paddingHorizontal:scale(20),
    }

})