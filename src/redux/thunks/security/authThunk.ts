
import {
  autentication, 
  setToken, 
  setUserInfo, 
  startLoading,
} from "../../slices/security/authSlice";
import { Dispatch } from "redux";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginResponse, UserCredentialsFetch } from "../../../interfaces/auth/authInterfaces";
import axios from "../../../../axiosConfig";
import Toast from 'react-native-root-toast';
import jwtDecode from "jwt-decode";

const url = process.env.EXPO_PUBLIC_API_URL;

/* check if the user is registered */
export const loginThunk = (userCredentials: UserCredentialsFetch) => async (dispatch: Dispatch) => {

  const { usuario, clave } = userCredentials;

    try {
      dispatch(startLoading());
      let  {data}  = await axios.post<LoginResponse>( `/login`, 
      { usuario, clave }, 
      { } 
      );
      await AsyncStorage.setItem('Authorization', data?.token as string);
      const decodedToken = jwtDecode(data?.token ?? '');
      dispatch(setToken(data?.token));
      dispatch(setUserInfo(decodedToken));
      dispatch(autentication('authenticated'));
    } catch (err: any) {
      dispatch(autentication('unauthenticated'))
      throw err;
    }
  };

export const authenticationThunk = () => async (dispatch: Dispatch) => {

  try {
    let data  = await axios.get( `/validar_token`);
    dispatch(autentication('authenticated'))
  } catch (err: any) {
    dispatch(autentication('unauthenticated'))
    throw err;
  }
};

