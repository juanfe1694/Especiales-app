import React from 'react'
import { View, StyleSheet, Image, Text } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize'

export const BlankPage = () => {
  return (
    <View style={styles.mainContainer}>
        <Image style={styles.img} source={require('../../../assets/images/blank-page.jpg')} />
        <Text style={styles.text}>No hay nada para mostrar aún.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    mainContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    img: {
        width: RFPercentage(20),
        height:RFPercentage(20)
    },
    text:{
        fontSize: RFPercentage(2.5),
        color: 'gray'
    }
})
