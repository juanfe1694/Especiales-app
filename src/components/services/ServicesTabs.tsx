import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { ServiceTabsProps } from '../../interfaces/services/servicesInterfaces'
import { Badge } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setRequestState } from '../../redux/slices/services/companyServicesSlice';

export const ServicesTabs = ({ items, action } : ServiceTabsProps) => {
    const { requestState } = useAppSelector(state => state.services);
    //const [activeItem, setactiveItem] = useState('');
    const dispatch = useAppDispatch();
    const handleChange = (item: string) => {
        //setactiveItem(item);
        dispatch(setRequestState('Activos'));
        action(item);
    }

  return (
    <View style={ ServicesTabsStyles.mainContainer }>
        {
            items.map((item, index: number) => 
                <TouchableOpacity 
                    key={item.label}
                    style={[
                        ServicesTabsStyles.tabItem,
                        requestState == item.label && ServicesTabsStyles.activeItem
                    ]}
                    onPress={() => handleChange(item.label)}
                >
                    <View 
                        style={[ 
                            ServicesTabsStyles.itemContainer,
                            index != items.length -1
                                && { borderRightColor: '#BFBFC0',
                                     borderRightWidth: 1, }
                        ]}
                    >
                        <Text style={ ServicesTabsStyles.label }>
                            { item.label }
                        </Text>
                        { 
                            item.notification &&
                            <Badge size={10} style={ ServicesTabsStyles.badge }></Badge>
                        }
                    </View>
                </TouchableOpacity>
            )
        }
    </View>
  )
}

const ServicesTabsStyles = StyleSheet.create({
    mainContainer:{
        flexDirection: 'row'
    },
    tabItem:{
        paddingVertical: 10,
        paddingLeft: 10,
    },
    activeItem:{
        borderBottomColor: '#002851',
        borderBottomWidth: 3
    },
    itemContainer:{
        flexDirection: 'row',
        paddingRight: 10
    },
    label:{
        fontWeight: '400',
        fontSize: 15,
        alignSelf: 'center'
    },
    badge:{
        alignSelf:'flex-start',
        margin: 2

    }
})

