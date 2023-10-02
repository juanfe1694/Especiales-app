import { createDrawerNavigator } from '@react-navigation/drawer';
import { PortalScreen } from '../screens/portal/PortalScreen';
import { DrawerParamList } from '../../types';
import { ScheduleCompanyServiceScreen } from '../screens/services/ScheduleCompanyServiceScreen';
import { ServicesListScreen } from '../screens/services/ServicesListScreen';
import { DriverMapScreen } from '../screens/maps/DriverMapScreen';

const Drawer = createDrawerNavigator<DrawerParamList>();

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={ PortalScreen } />
      <Drawer.Screen 
        name="ScheduleServiceCompany" 
        component={ ScheduleCompanyServiceScreen }
        options={{title:'Programar servicio'}}
      />
      <Drawer.Screen 
        name="ServicesListScreen" 
        component={ ServicesListScreen }
        options={{title:'Historial de servicios'}}
      />
      <Drawer.Screen 
        name="DriverMapScreen" 
        component={ DriverMapScreen }
        options={{title:'Mapa'}}
      />
      
    </Drawer.Navigator>
  );
}