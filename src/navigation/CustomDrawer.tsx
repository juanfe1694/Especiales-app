import React from 'react'
import { Text, View, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import { drawerStyles } from './CustomDrawerStyles';
import { Divider, Button  } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { autentication } from '../redux/slices/security/authSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { DrawerRoutes } from '../interfaces/functionalInterfaces';

export const CustomDrawer = ( { descriptors, navigation, state } : DrawerContentComponentProps) => {
    
    const { userInfo } = useAppSelector(state => state.auth);

    const dispatch = useAppDispatch();

    const logout = () => {
        AsyncStorage.removeItem('Authorization').then(() => {
          dispatch(autentication('unauthenticated'))
        })
    }

    const renderTab = (route: any, isFocused: boolean, permission: string) => {

        return (
          <TouchableOpacity
            activeOpacity={0.8}
            key={route?.key}
            onPress={() => navigation?.navigate(route?.name)}
          >
            <Text
                style={[
                    drawerStyles.permissionText,
                    isFocused && { ...drawerStyles.permissionSelected }
                ]}
            >
                { permission } 
            </Text> 
          </TouchableOpacity>
        );
      };

  return (
    <SafeAreaView style={drawerStyles.mainContainter}>
        <View style={drawerStyles.imageContainter}>
            <Image 
                source={require('../../assets/logos/Logo-especiales.jpg')} 
                style={drawerStyles.image}
            />
        </View>
        <DrawerContentScrollView>
           {/* <View 
                style={drawerStyles.moduleContainer}
            >
                <Text style={drawerStyles.moduleText}>
                        Portal
                </Text>
                {
                    renderTab(
                        state?.routes.find((route) => route.name === DrawerRoutes['Inicio']),  
                        state.routes[state.index].name === DrawerRoutes['Inicio'],
                        'Inicio'
                    )
                }
                <Divider style={{marginTop: 10}} />
            </View>
            */}
            {
                userInfo?.permisos?.map(item => 
                    <View 
                        key={item.modulo}
                        style={drawerStyles.moduleContainer}
                    >
                        <Text style={drawerStyles.moduleText}>
                            { item.modulo }
                        </Text>
                        {
                            item.permisos.map((permission) =>
                                <>
                                    {renderTab(
                                        state?.routes.find((route) => route.name === DrawerRoutes[permission]),  
                                        state.routes[state.index].name === DrawerRoutes[permission],
                                        permission
                                    )}
                                </>
                            )
                        }
                        <Divider style={{marginTop: 10}} />
                    </View>
                )
            }
        </DrawerContentScrollView>
        <View>
          { /* <Text> Estado del usuario </Text> */ }
            <Button 
                icon="logout" 
                mode="outlined" 
                onPress={logout}
                style={{marginVertical: 10}}
            >
                Cerrar sesión
            </Button>
        </View>
    </SafeAreaView>
  )
}
