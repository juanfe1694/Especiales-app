import { StatusBar } from 'expo-status-bar';
import useColorScheme from './src/hooks/useColorScheme';
import Navigation from './src/navigation/StackNavigator';
import { Provider } from 'react-redux';
import { store } from './src/app/store';
import { RootSiblingParent } from 'react-native-root-siblings';
import 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';

export default function App() {

  const colorScheme = useColorScheme();
 
  return (
    <PaperProvider>
      <Provider store={store}>
        <RootSiblingParent>
          <Navigation colorScheme={colorScheme} />
          <StatusBar style="auto" />
        </RootSiblingParent>
      </Provider>
    </PaperProvider>
  );
}
