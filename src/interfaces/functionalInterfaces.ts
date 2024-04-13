import { NativeStackScreenProps } from "@react-navigation/native-stack";

export interface NavigationProps extends NativeStackScreenProps<any, any>{}

export enum DrawerRoutes {
    'Programar servicio' = 'ScheduleServiceCompany',
    'Mis servicios' = 'ServicesListScreen',
    'Inicio' = 'Home',
    'Servicios' = 'DriverServicesListScreen',
    'Crear usuario' = 'BlankPageScreen'
}

