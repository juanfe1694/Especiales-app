/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  ColorSchemeName,
} from "react-native";
import { RootStackParamList } from "../../types";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { useCheckAuth } from "../hooks/useCheckAuth";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Loading } from "../screens/utilities/Loading";
import { DrawerNavigator } from "./DrawerNavigator";
import { setTheme } from "../redux/slices/theme/themeSlice";
import { PaperProvider, MD3LightTheme, MD3Theme } from 'react-native-paper';

//import { getMessaging, getToken } from "firebase/messaging";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {

  const { theme, light, dark } = useAppSelector(state => state.theme);
  const dispatch = useAppDispatch();
  //const messaging = getMessaging();
// Add the public key generated from the console here.
  //getToken(messaging, {vapidKey: "n2wtZKjBZBvX8vCCnM9wWAJadw-Mk2u7-vRs6Y8r2fw"});
  useEffect(() => {
    dispatch(setTheme(light))

    /*if( colorScheme == 'light' ){
      dispatch(setTheme(light))
    }else{
      dispatch(setTheme(dark))
    }*/
  }, [])
  const paperTheme : MD3Theme = {
    ...MD3LightTheme,
    colors:{
      ...MD3LightTheme.colors,
      primaryContainer:'white',
      elevation:{
        ...MD3LightTheme.colors.elevation,
        level3:'white'
      },
      primary: "#002851",
      background: 'white',
    }

  }
  
  return (
    <PaperProvider theme={ paperTheme }>
        <RootNavigator />
    </PaperProvider>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();


export function RootNavigator() {

  const { autentication } = useAppSelector(state => state.auth);
  useCheckAuth();

  switch (autentication) {
    case 'verifying':
      return <Loading />
    case 'unauthenticated':
      return <LoginScreen />
    default:
      break;
  }

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="PortalScreen"
        component={ DrawerNavigator }
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />

    </Stack.Navigator>
  );
}
