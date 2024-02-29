import React, { useEffect, useState } from 'react'
import MapView, {LatLng, Marker, Polyline, Region} from 'react-native-maps';
import { useAppDispatch } from '../../app/hooks';
import { getRouteThunk } from '../../redux/thunks/maps/mapsThunk';
import * as Location from 'expo-location';
import { Address, LocationProps } from '../../interfaces/locations/locationInterfaces';
import polyline from '@mapbox/polyline';

const initialRegion : Region  = {
  latitude: 6.149849,
  longitude: -75.388507,
  latitudeDelta: 0.012878364292202349, 
  longitudeDelta: 0.007097460329546834,
}

export const DriverMap = () => {
  

  const [userLocation, setUserLocation] = useState<LocationProps>();
  const [region, setRegion] = useState<Region>(initialRegion);
  const [decodedPolyline, setdecodedPolyline] = useState<LatLng[]>([]);
  const dispatch = useAppDispatch();
  const markerUri = process.env.EXPO_PUBLIC_MARKER_URI;

  useEffect(() => {

     (async () => {
      // Solicitar permisos de ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permiso de ubicación denegado');
        return;
      }

      //await getUserLocation();
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 10,
        },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          const currentRegion = {...region};
          setUserLocation({ latitude, longitude });
          setRegion({...currentRegion, latitude: latitude, longitude: longitude});
          
          updatePolyline(
            {
              description:'Rionegro',
              latitude: latitude,
              longitude: longitude
            },
            {
              description:'La Union',
              latitude: 5.9727777,
              longitude: -75.3611111
            },
            new Date())

        }
      );
      
    })();

  }, [])

  const updatePolyline = (origin: Address, destination: Address, departureTime: Date) => {
    dispatch(getRouteThunk({
      origin: {
        description:'Rionegro',
        latitude: 6.1424516,
        longitude: -75.3794229
      },
      destination:{
        description:'La Union',
        latitude: 5.9727777,
        longitude: -75.3611111
      },
      departureTime: new Date()
    })).then((data) => {
      const encodedPolyline = data.routes[0].polyline.encodedPolyline;
      const decodedPolyline = polyline.decode(encodedPolyline);
      const routeCoordinates = decodedPolyline.map((point) => ({
        latitude: point[0],
        longitude: point[1],
      }));
      setdecodedPolyline(routeCoordinates)
    })
    .catch((error) => {
      console.log(error)
    });
  }
  
  return (
    <MapView 
      initialRegion={ region } 
      region={ region }
      style={{
        width: '100%',
        height: '100%',
      }}
    >
        <Polyline
        coordinates={decodedPolyline}
        strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
        strokeColors={[
            '#7F0000',
            '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
            '#B24112',
            '#E5845C',
            '#238C23',
            '#7F0000',
        ]}
        strokeWidth={10}
        />
        {
                userLocation && (
                    <Marker
                        draggable
                        coordinate={{
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude,
                        }}
                        //onDragEnd={(e) => onDragMarker( e.nativeEvent.coordinate )}
                        image={{uri: markerUri}}
                    />
                )
            }
    </MapView>
  )
}
