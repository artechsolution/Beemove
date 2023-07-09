import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Animated, {useSharedValue, useAnimatedStyle, withTiming} from 'react-native-reanimated'
import { Spacer } from './Spacer'
import { colors } from '../../Utils/Colors'
const Swipup = ({onPressIn}) => {
    
  const animation = useSharedValue({width:50,height:4})

  const animationStyle = useAnimatedStyle(() => {
    return{
      width: withTiming(animation.value.width,{
        duration:1000
      }),
      height: withTiming(animation.value.height,{
        duration:600
      })
    }
  })
  return (
    <TouchableOpacity
        onPressIn={onPressIn}
        // onPress={() => {
        //     animation.value = {width:300,height:450}
        //   }}
        style={{
          // height: 100,
          position:'absolute',
          bottom:0,
          width: "100%",
          backgroundColor: colors.white,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,

          elevation: 10,
          marginTop: 20,
          borderRadius: 20,
        }}
      >
        <Spacer height={10} />
        <Animated.View
          style={[{
            // height: 4,
            borderRadius: 2,
            backgroundColor: "#ccc",
            // width: 50,
            alignSelf: "center",
          },animationStyle]}
        />
        <Spacer height={50} />
      </TouchableOpacity>
  )
}

export default Swipup

const styles = StyleSheet.create({})