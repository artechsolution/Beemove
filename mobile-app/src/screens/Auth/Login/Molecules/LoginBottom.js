import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomButton from '../../../../components/CustomButton'
import { Spacer } from '../../../../components/Spacer'
import { colors } from '../../../../../Utils/Colors'
import { verticalScale } from 'react-native-size-matters'

const LoginBottom = ({onLogin,title}) => {
  return (
    <View>
 <CustomButton
          width={"100%"}
          height={verticalScale(45)}
          title={title}
          fontSize={12}
          onPress={onLogin}
          backgroundColor={colors.primary}
          borderColor={colors.primary}
          color={colors.black}
          borderWidth={-1}
          fontFamily="Roboto-Regular"
        />  
        <Spacer height={20}/>


    </View>
  )
}

export default LoginBottom

const styles = StyleSheet.create({})