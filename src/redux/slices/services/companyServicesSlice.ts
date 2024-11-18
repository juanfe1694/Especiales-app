import { createSlice } from '@reduxjs/toolkit';


/* gloabal states and functions */

type InitialState = {
  requestState: string;
  serviceLocations: any[],
  isLoading: boolean
}

const initialState: InitialState = {
  requestState: '',
  serviceLocations: [],
  isLoading: false
}

const companyServicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setRequestState: (state, action) => {
      state.requestState = action.payload;
    },
    setServiceLocations: (state, action) => {
      state.serviceLocations = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
})

export const { setRequestState, setServiceLocations, setIsLoading } = companyServicesSlice.actions;
export const servicesReducer = companyServicesSlice.reducer;