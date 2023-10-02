import { createSlice } from '@reduxjs/toolkit';


/* gloabal states and functions */


type InitialState = {

}

const initialState: InitialState = {

}




const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
  },
})

export const { } = userSlice.actions;
export const userReducer = userSlice.reducer;