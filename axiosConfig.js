import axios from 'axios';
import { decode, encode } from "base-64";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import { authUser } from './src/hooks/useRenewExpiredToken';

if (!global.btoa) {
    global.btoa = encode;
  }
  
  if (!global.atob) {
    global.atob = decode;
  }

// Configuración de Axios para React Native
axios.defaults.baseURL = process.env.EXPO_PUBLIC_API_URL;
axios.interceptors.request.use(
  async(config) => {
    const token = await AsyncStorage.getItem('Authorization');
    if(token){
      config.headers.Authorization = token;
      config.headers.Accept = 'text/plain';
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  }
)

// Interceptor de respuesta para manejar el estado 401 (Unauthorized) para token expirado
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Respuesta 401 recibida');
      //authUser();
    }
    return Promise.reject(error);
  }
);
export default axios;