/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import React, { useEffect } from "react";
import {
  NavigationContainer,
} from "@react-navigation/native";
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
import { PaperProvider, MD3LightTheme, adaptNavigationTheme, MD3Theme } from 'react-native-paper';

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {

  const { theme, light, dark } = useAppSelector(state => state.theme);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if( colorScheme == 'light' ){
      dispatch(setTheme(light))
    }else{
      dispatch(setTheme(dark))
    }
  }, [])

  const paperTheme : MD3Theme = {
    ...MD3LightTheme,
    colors:{
      ...MD3LightTheme.colors,
      primary: "#002851",
      background: 'white',
    }

  }
  
  return (
    <PaperProvider theme={ paperTheme }>
      <NavigationContainer
        theme={
          theme
        }
      >
        <RootNavigator />
      </NavigationContainer>
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
