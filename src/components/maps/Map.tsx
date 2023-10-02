import React, { useEffect, useState } from 'react'
import { View,StyleSheet, Text } from 'react-native'
import MapView, { Region, Marker, LatLng, MapPressEvent, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { AutoCompleteLocations } from './AutoCompleteLocations';
import { MainButton } from '../../app/custom-components/MainButton';
import { useKeyBoardVisibilityListener } from '../../hooks/useKeyBoardVisibilityListener';
import { GooglePlaceData, GooglePlaceDetail } from 'react-native-google-places-autocomplete';
import axios from 'axios';
import { Address, LocationProps } from '../../interfaces/locations/locationInterfaces';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'
import { RFPercentage } from 'react-native-responsive-fontsize';
import { SecondaryButton } from '../../app/custom-components/SecondaryButton';


const initialRegion : Region  = {
    latitude: 6.149849,
    longitude: -75.388507,
    latitudeDelta: 0.012878364292202349, 
    longitudeDelta: 0.007097460329546834,
  }

  type Props = {
    onLocationChange: (location : Address) => void;
    setshowAddressSelector: (visible : boolean) => void;
  }

export const Map = ( { onLocationChange, setshowAddressSelector } : Props ) => {

    const [userLocation, setUserLocation] = useState<LocationProps>();
    const [region, setRegion] = useState<Region>(initialRegion);
    const { isKeyboardVisible } = useKeyBoardVisibilityListener();
    const [addressText, setaddressText] = useState('');
    const [selectedAddres, setselectedAddres] = useState<Address>();
    const apiKey = process.env.EXPO_PUBLIC_LOCATIONS_API_KEY;
    const markerUri = process.env.EXPO_PUBLIC_MARKER_URI;

    const navigation = useNavigation();

    const header = () => (
      <View style={{marginRight: RFPercentage(3)}}>
        <Ionicons name='locate' size={30} onPress={getUserLocation} />
      </View>
    )

    useEffect(() => {

      navigation.setOptions({
        title: 'Ubicación en mapa',
        headerRight: () =>  header()

      });

      (async () => {
        // Solicitar permisos de ubicación
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permiso de ubicación denegado');
          return;
        }

        await getUserLocation();
        
      })();
    }, []);

    const getUserLocation = async () => {

      // Obtener la ubicación actual del usuario
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const currentRegion = {...region};
      await getAddressDescription({ latitude, longitude });
      //setaddressText(userUbication);
      setUserLocation({ latitude, longitude });
      setRegion({...currentRegion, latitude: latitude, longitude: longitude});
    }

    const handleChangeLocation = (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
      const latitude = details?.geometry.location.lat || 0;
      const longitude = details?.geometry.location.lng || 0;
      const address = details?.formatted_address as string;
      const currentRegion = {...region};
      setRegion({...currentRegion, latitude: latitude, longitude: longitude})
      setUserLocation({ latitude, longitude });
      setselectedAddres({ latitude, longitude, description:  address})
      setaddressText(address);
    }

    const getAddressDescription = async (e: LatLng) => {
      try {
        const { latitude, longitude } = e;
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
        );
        if (response.data.results.length > 0) {
          const address = response.data.results[0].formatted_address;
          setaddressText(address);
          setselectedAddres({ ...e, description: address });
          return address;
        }

      } catch (error) {
        console.log(error)
        return null
      }
    }

    const onDragMarker = async ( e: LatLng ) => {
      await getAddressDescription(e);
      setUserLocation(e);
    }
      
  return (
    <View style={styles.container}>
        <MapView 
            provider={PROVIDER_GOOGLE}
            style={ styles.map }
            initialRegion={ region } 
            region={ region }
            onPress={(e : MapPressEvent) => onDragMarker(e.nativeEvent.coordinate)}
        >       
            {
                userLocation && (
                    <Marker
                        draggable
                        coordinate={{
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude,
                        }}
                        onDragEnd={(e) => onDragMarker( e.nativeEvent.coordinate )}
                        image={{uri: markerUri}}
                    />
                )
            }

        </MapView>
           
        <View style={{position: "absolute", top:30, alignSelf: 'center', width: '90%'}}>
          <AutoCompleteLocations 
            handleChangeLocation={ handleChangeLocation }
            addressText={addressText}
          />
        </View>
        {
          !isKeyboardVisible &&
          <View style={{position: "absolute", bottom:30, alignSelf: 'center', width: '90%'}}>
              <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                
                <View style={{width: '40%'}}>
                  <SecondaryButton 
                      isLoading={false}
                      label='Cancelar'
                      onLoadingLabel=''
                      onPress={()=> setshowAddressSelector(false)}
                    />
                  </View>

                <View style={{width: '55%'}}>
                  <MainButton 
                    isLoading={false}
                    label='Aceptar'
                    onLoadingLabel='Guardando elección'
                    onPress={() => onLocationChange( selectedAddres as Address)}
                  />
                </View>
                
              </View>
          </View>
        }
  </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      width: '100%',
      height: '100%',
    },
  });
