import React from 'react'
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export const Loading = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator animating={true} color={'#002851'} size={'large'} />
    </View>
  )
}
