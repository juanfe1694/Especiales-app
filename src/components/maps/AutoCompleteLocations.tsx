import React, { useEffect, useRef, useState } from 'react'
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';
import { useAppSelector } from '../../app/hooks';

type Props = {
    handleChangeLocation: (data: GooglePlaceData, details: GooglePlaceDetail | null) => void;
    addressText: string;
}

export const AutoCompleteLocations = ( { handleChangeLocation, addressText }: Props ) => {
    
    const { theme } = useAppSelector(state => state.theme);
    
    const apiKey = process.env.EXPO_PUBLIC_LOCATIONS_API_KEY;

    const mapRef = useRef<GooglePlacesAutocompleteRef>(null);

    useEffect(() => {
        mapRef?.current?.setAddressText(addressText); 
    }, [ addressText ])
    

    const clearQuery = () => {
        mapRef?.current?.clear();
        mapRef?.current?.blur();
    }

    const rightIcon = () => (
        <View style={{justifyContent: 'center', marginRight: 10}}>
            <Ionicons 
                style={{color: 'gray'}}
                name='close-circle' 
                onPress={clearQuery} 
                size={20} 
            />
        </View>
    )
    
    return (
        <View style={{ backgroundColor: theme.colors.background, borderRadius: 5 }}>
            <GooglePlacesAutocomplete
                ref={mapRef}
                keepResultsAfterBlur={false}
                renderRightButton={ rightIcon }
                placeholder='Buscar'
                minLength={2}
                disableScroll={false}
                enablePoweredByContainer={false}
                fetchDetails={true}
                renderDescription={(row) => row.description}
                onPress={(data, details = null) => {
                    handleChangeLocation(data, details);
                }}

                onFail={(error) => console.error(error)}
                query={{
                    key: apiKey,
                    language: 'es',
                    components: 'country:CO'
                }}
                nearbyPlacesAPI="GooglePlacesSearch"
            />
        </View>
    )
}
