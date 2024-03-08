import { createDrawerNavigator } from '@react-navigation/drawer';
import { PortalScreen } from '../screens/portal/PortalScreen';
import { DrawerParamList } from '../../types';
import { ScheduleCompanyServiceScreen } from '../screens/services/ScheduleCompanyServiceScreen';
import { ServicesListScreen } from '../screens/services/ServicesListScreen';
import { DriverMapScreen } from '../screens/maps/DriverMapScreen';
import { CustomDrawer } from './CustomDrawer';
import { DriverServicesListScreen } from '../screens/services/DriverServicesListScreen';
import { updateTokenThunk } from "../redux/thunks/users/usersThunk";
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useEffect, useState } from 'react';

async function registerForPushNotificationsAsync() {
  let token;
  
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    try {
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants?.expoConfig?.extra?.eas.projectId,
      })).data
    
    } catch (error) {
      throw error;
    }
    
    /*token = (await Notifications.getDevicePushTokenAsync())*/
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }
  
  return token;
}

const Drawer = createDrawerNavigator<DrawerParamList>();

export const DrawerNavigator = () => {
  const {userInfo} = useAppSelector(state => state.auth);
  const [expoPushToken, setExpoPushToken] = useState('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => {
        setExpoPushToken(token as any)
      })
      .catch((error) => {
        setExpoPushToken(error)
      })
  }, [])

  useEffect(() => {
    if(userInfo?.numeroDocumento && expoPushToken)
      dispatch(updateTokenThunk(userInfo?.numeroDocumento.toString(), expoPushToken))
  }, [expoPushToken])

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen 
        name="DriverServicesListScreen" 
        component={ DriverServicesListScreen }
        options={{title:'Historial de servicios'}}
      />
      
      <Drawer.Screen name="Home" component={ PortalScreen } />
      <Drawer.Screen 
        name="ScheduleServiceCompany" 
        component={ ScheduleCompanyServiceScreen }
        options={{title:'Programar servicio'}}
      />
      {/*<Drawer.Screen 
        name="ServicesListScreen" 
        component={ ServicesListScreen }
        options={{title:'Historial de servicios'}}
      />
      <Drawer.Screen 
        name="DriverServicesListScreen" 
        component={ DriverServicesListScreen }
        options={{title:'Historial de servicios'}}
      />
      <Drawer.Screen 
        name="DriverMapScreen" 
        component={ DriverMapScreen }
        options={{title:'Mapa'}}
      />
    */}
    </Drawer.Navigator>
  );
}