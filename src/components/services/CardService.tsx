import React, { useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { scheduleServiceCompany, serviceState } from '../../interfaces/services/servicesInterfaces';
import { Chip } from 'react-native-paper';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDateTimeFormater } from '../../hooks/useDateTimeFormater';

export const CardService = ({ 
    origin, 
    destination, 
    numberOfPassengers, 
    pickUpDate, 
    pickUpTime,
    returnDate,
    returnTime,
    requestState,
    driverName,
    vehicle} : scheduleServiceCompany) => {

    const [showInfo, setshowInfo] = useState(false);
    const { getFormatedDate, getFormatedTime } = useDateTimeFormater();

    const colorMap: {[key:  string]: string} = {
        'Pendiente' : '#D35400',
        'Confirmado' : '#5499C7',
        'Cancelado' : '#CD6155'
    }
    const DURATION = 1000;
    const opacity = useSharedValue(0);

    const dateFormat: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      };

    const showTripInfo = () => {
        if (showInfo) {
          //ocultar
          opacity.value = withTiming(0, { duration: DURATION });

    
        } else {
          //mostrar
          opacity.value = withTiming(1, { duration: DURATION });
        }
    
        setshowInfo(!showInfo);
      };

  return (
    <View 
        style={{
            ...cardStyles.card,
            borderLeftWidth: 3,
            borderLeftColor: colorMap[requestState as string],
            borderTopColor: colorMap[requestState as string],

        }}
    >

        {/** Contenedor del estado */}
        <View 
            style={{
                borderTopStartRadius: 4,
                borderTopEndRadius: 4,
                alignItems: 'flex-end',
                backgroundColor: colorMap[requestState as string]
                }}>

            <Text 
                style={{marginHorizontal: 10, 
                //color: colorMap[requestState as string]
                color:'white'
            }}
            >
                { requestState }
            </Text>
        </View>
        <View style={cardStyles.stateContainer}>
            <Text>
                <Ionicons name='calendar-outline' size={RFPercentage(2)} />
                {' '}
                { getFormatedDate(pickUpDate) }
                {' '}
                { getFormatedTime(pickUpTime) }
            </Text>
            <Text>
                <Ionicons name='people' size={RFPercentage(2)} />
                {' '}
                { numberOfPassengers }
            </Text>
            {/*<Chip 
                style={{
                    backgroundColor: 'white',
                }} 
                selectedColor='gray' 
            >
                # 225
            </Chip>*/}
        </View>

        {/** Detalles del servicio */}
        <View>
            <View style={cardStyles.cardRow}>
                <Text><Ionicons name='location-sharp' size={RFPercentage(2)} /> Origen </Text>
                <Text style={{flex: 1, textAlign:'right'}}> { origin } </Text>
            </View>
            <View style={cardStyles.cardRow}>
                <Text><Ionicons name='location-sharp' size={RFPercentage(2)} />  Destino </Text>
                <Text> { destination } </Text>
            </View>
            <Animated.View
                style={{
                    opacity: opacity
                }}
            >
                { showInfo &&
                    <>
                    {
                        returnDate &&
                        <View style={cardStyles.stateContainer}>
                            <Text>
                                <Ionicons name='calendar-outline' size={RFPercentage(2)} />
                                {' '}
                                Regreso
                            </Text>
                            <Text>
                                { getFormatedDate(returnDate) }
                                {' '}
                                { getFormatedTime(returnTime as Date) }
                            </Text>
                        </View>
                    }
                        <View style={cardStyles.cardRow}>
                            <Text> 
                                <Ionicons name='man' size={RFPercentage(2)} /> 
                                {' '}
                                <Text style={cardStyles.hyperText}>{driverName}</Text> 
                            </Text>
                            <Text> 
                                <Ionicons name='car-sport' size={RFPercentage(2)} />
                                {' '}
                                <Text style={cardStyles.hyperText}>{vehicle}</Text> 
                            </Text>
                        </View>
                    </>
                }
            </Animated.View>

            <View style={[cardStyles.cardRow, {justifyContent: 'center'}]}>
                
                { 
                    (requestState == 'Confirmado' || returnDate) &&
                    <TouchableOpacity onPress={showTripInfo} activeOpacity={0.8} >
    
                        {
                            showInfo
                                ? <Text>Ocultar detalles <Ionicons name='chevron-up' size={RFPercentage(2)} /></Text> 
                                : <Text>Mostrar detalles <Ionicons name='chevron-down' size={RFPercentage(2)} /></Text> 
                        } 
                    
                    </TouchableOpacity>
                }
            </View>
        </View>
    </View>
  )
}

const cardStyles = StyleSheet.create({
    card:{
        borderWidth:1,
        borderTopColor: '#D0D3D4',
        borderRightColor: '#D0D3D4',
        borderBottomColor: '#D0D3D4',
        borderRadius: 7,
        margin: 15
    },
    cardRow:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginVertical: 5
    },
    stateContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10
    },
    hyperText:{
        textDecorationLine: 'underline'
    }
})
