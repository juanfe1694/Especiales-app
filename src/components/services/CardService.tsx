import React, { useState } from 'react'
import { View, Text } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Vehicle, scheduleServiceCompany } from '../../interfaces/services/servicesInterfaces';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDateTimeFormater } from '../../hooks/useDateTimeFormater';
import { MainButton } from '../../app/custom-components/MainButton';
import { useDriverEnterpriseService } from '../../hooks/useDriverEnterpriseService';
import { cardStyles } from './cardStyles';

type Props = {
    service: scheduleServiceCompany,
    showDetail: (serviceId: string) => void
}

export const CardService = ({ service, showDetail } : Props) => {
    const { 
        origin, 
        destination, 
        numberOfPassengers, 
        pickUpDate, 
        pickUpTime,
        returnDate,
        returnTime,
        requestState,
        driver,
        vehicle, 
        serviceId} : scheduleServiceCompany = service;

    const [showInfo, setshowInfo] = useState(false);
    const { getFormatedDate, getFormatedTime } = useDateTimeFormater();
    const { resEnterpriseService } = useDriverEnterpriseService();
    const regVehicle = (vehicle as Vehicle)?.label ?? '';

    const colorMap: {[key:  string]: string} = {
        'Asignado' : '#697586',
        'Confirmado' : '#0A2378',
        'Rechazado' : '#AB0000',
        'Completado' : '#00B710',
        'Transito' : '#0F9905'
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
    
    const confirmService = () => {
        resEnterpriseService(service)
    }

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => showDetail(serviceId as string)}>
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
                    <Text style={{flex: 1, textAlign:'right'}}> { origin.description } </Text>
                </View>
                <View style={cardStyles.cardRow}>
                    <Text><Ionicons name='location-sharp' size={RFPercentage(2)} />  Destino </Text>
                    <Text style={{flex: 1, textAlign:'right'}}> { destination.description } </Text>
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
                                    <Text style={cardStyles.hyperText}>{driver?.label}</Text> 
                                </Text>
                                <Text> 
                                    <Ionicons name='car-sport' size={RFPercentage(2)} />
                                    {' '}
                                    <Text style={cardStyles.hyperText}>{regVehicle}</Text> 
                                </Text>
                            </View>
                        </>
                    }
                </Animated.View>

                <View style={[cardStyles.cardRow, {justifyContent: 'center'}]}>
                    
                    { /*
                        (requestState == 'Confirmado' || requestState == 'Asignado' || returnDate) &&
                        <TouchableOpacity onPress={showTripInfo} activeOpacity={0.8} >
                            <Text>Mostrar detalles <Ionicons name='add-circle-outline' size={RFPercentage(2)} /></Text> 
                        </TouchableOpacity>
                */}

                </View>
            </View>
        </View>
    </TouchableOpacity>
  )
}