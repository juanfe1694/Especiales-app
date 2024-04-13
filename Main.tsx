import { StatusBar } from 'expo-status-bar';
import useColorScheme from './src/hooks/useColorScheme';
import Navigation from './src/navigation/StackNavigator';
import { RootSiblingParent } from 'react-native-root-siblings';
import 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Main() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef<React.MutableRefObject<undefined>>();
  const responseListener = useRef();
  
  const colorScheme = useColorScheme();
  const nav = useNavigation();
  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      if(response.notification.request.content.data.receptor== 'Conductor'){
        const serviceId = response.notification.request.content.data.serviceId;
        nav.navigate('DriverServicesListScreen',{ serviceId: serviceId })
      }else if(response.notification.request.content.data.receptor == 'Usuario'){
        nav.navigate('ServicesListScreen')
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };

  }, []);

  return (
    <PaperProvider>
        <RootSiblingParent>
          <Navigation colorScheme={colorScheme} />
          <StatusBar style="auto" />
        </RootSiblingParent>
    </PaperProvider>
  );
}
