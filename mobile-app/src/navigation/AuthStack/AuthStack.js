import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import LoginRegister from '../../screens/Auth/LoginRegister/LoginRegister'
import Register from '../../screens/Auth/Register/Register'
import PhoneNumber from '../../screens/Auth/Register/PhoneNumber/PhoneNumber'
import OtpScreen from '../../screens/Auth/Register/Otp/OtpScreen'
import Login from '../../screens/Auth/Login/Login'
const Stack=createStackNavigator()

const AuthStack = () => {
  return (
      <Stack.Navigator
      screenOptions={{headerShown:false}}
      // initialRouteName="Register"
      >
           {/* <Stack.Screen name="LoginScreen" component={Login}/> */}
          <Stack.Screen name="LoginRegister" component={LoginRegister}/>
          <Stack.Screen name="PhoneNumber" component={PhoneNumber}/>
          <Stack.Screen name="Register" component={Register}/>
          <Stack.Screen name="OtpScreen" component={OtpScreen}/>



      </Stack.Navigator>
  
  )
}

export default AuthStack