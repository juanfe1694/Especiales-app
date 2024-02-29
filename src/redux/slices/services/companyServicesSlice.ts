import { createSlice } from '@reduxjs/toolkit';


/* gloabal states and functions */

type InitialState = {
    requestState: string;

}

const initialState: InitialState = {
    requestState: ''
}

const companyServicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setRequestState: (state,action) => {
        state.requestState = action.payload;
      },
  },
})

export const { setRequestState } = companyServicesSlice.actions;
export const servicesReducer = companyServicesSlice.reducer;