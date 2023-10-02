/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DrawerScreenProps } from "@react-navigation/drawer";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  LoginScreen:  undefined;
  PortalScreen: NavigatorScreenParams<DrawerParamList> | undefined;
};

export type DrawerParamList = {
  Home: undefined;
  ScheduleServiceCompany: undefined;
  ServicesListScreen: undefined;
  DriverMapScreen: undefined;
};


export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootDrawerScreenProps<Screen extends keyof DrawerParamList> = 
  CompositeScreenProps< 
    DrawerScreenProps<DrawerParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
