import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

export const useDecodeToken = () => {

    const decodeToken = async() =>{
       const token = await AsyncStorage.getItem('Authorization') ?? '';
       const decodedToken = jwtDecode(token);
      return decodedToken;
    }
  return { decodeToken }
}
