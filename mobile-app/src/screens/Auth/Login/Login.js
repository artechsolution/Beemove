import { StyleSheet, Text, View,SafeAreaView } from 'react-native'
import React from 'react'
import commonStyles from '../../../../Utils/CommonStyles'
import { Spacer } from '../../../components/Spacer'
import LoginRegHeader from '../LoginRegister/Molecules/LoginRegHeader'
import PercentageSpacer from '../../../components/PercentageSpacer'
import LoginBottom from './Molecules/LoginBottom'

const Login = ({navigation}) => {
  return (
    <SafeAreaView style={commonStyles.container}>
    <Spacer height={10}/>
      <LoginRegHeader/>
      <View style={commonStyles.PH30}>
      <PercentageSpacer height={"27%"}/>
      <LoginBottom
      onLogin={()=>{
        navigation.navigate("LoginRegister")

      }}
      />
      </View>
      

  
      
    
  </SafeAreaView>
  )
}

export default Login

const styles = StyleSheet.create({})