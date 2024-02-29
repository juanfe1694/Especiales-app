import { Provider } from 'react-redux';
import { store } from './src/app/store';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import Main from './Main';
import { light } from './src/theme/colorSchema';

export default function App() {

  return (
    <Provider store={store}>
      <NavigationContainer
          theme={
            light
          }
      >
        <Main /> 
      </NavigationContainer>
    </Provider>
  );
}