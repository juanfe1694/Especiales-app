import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useAppDispatch } from '../../app/hooks'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { autentication } from '../../redux/slices/security/authSlice';

export const PortalScreen = () => {
  const dispatch = useAppDispatch();

  const logout = () => {
      AsyncStorage.removeItem('Authorization').then(() => {
        dispatch(autentication('unauthenticated'))
      })
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems:'center'}}>
        <Text> PortalScreen </Text> 
        <TouchableOpacity onPress={logout}>
          <Text>Salir</Text>
        </TouchableOpacity>
    </View>
  )
}
