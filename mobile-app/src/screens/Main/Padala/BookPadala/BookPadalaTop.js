import { View, Text } from 'react-native'
import React from 'react'
import CustomTextInput from '../../../../components/CustomTextInput'
import { verticalScale } from 'react-native-size-matters'
import { colors } from '../../../../../Utils/Colors'
import { Entypo } from '@expo/vector-icons'; 
import { Spacer } from '../../../../components/Spacer'


const BookPadalaTop = () => {
  return (
    <View style={{flexDirection:"row",alignItems:"center"}}>

<Entypo name="location-pin" size={24} color={colors.grayBorder} />
<Spacer width={10}/>

    <CustomTextInput
            height={verticalScale(40)}
            width={"95%"}
            placeholder="Search Pick-off location"
            borderColor={colors.grayBorder}
            borderWidth={1}
            backgroundColor={colors.white}
            borderRadius={10}
            paddingLeft={20} 
            fontSize={11}
          />
            {/* <CustomTextInput
                withLabel={"Items Description"}
                placeholder={"Write description here..."}
                fontSize={12}
                height={verticalScale(40)}
                
                paddingLeft={20}
                // marginTop={verticalScale(10)}
                placeholderTextColor={"#9C9C9C"}
                fontFamily={"Roboto-Light"}
              /> */}
    </View>
  )
}

export default BookPadalaTop