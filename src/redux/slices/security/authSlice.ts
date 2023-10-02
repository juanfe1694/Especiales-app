import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userInfo } from '../../../interfaces/auth/authInterfaces';

/* gloabal states and functions */

type InitialState ={
  autentication: 'authenticated' | 'unauthenticated' | 'verifying';
  token: string;
  isLoading: boolean;
  userInfo: userInfo;
}

const initialState:InitialState ={
  autentication: 'verifying',
  token: '',
  isLoading: true,
  userInfo: {} as userInfo
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

    startLoading: (state) => {
      state.isLoading = true;
    },
    autentication: (state,action) => {
      state.autentication = action.payload;
      state.isLoading = false;
    },
    setToken: (state,action) => {
      state.token = action.payload;
      state.isLoading = false;
    },
    setUserInfo: (state,action) => {
      state.userInfo = action.payload;
    },
  },
})

export const { autentication, startLoading, setToken, setUserInfo } = authSlice.actions;
export const authReducer = authSlice.reducer;