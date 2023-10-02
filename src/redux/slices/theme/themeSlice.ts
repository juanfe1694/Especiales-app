import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GlobalTheme } from '../../../interfaces/theme/themeInterfaces';
import { dark, light, lightPaper } from '../../../theme/colorSchema';

/* gloabal states and functions */

type InitialState ={
  paperTheme: any,
  theme: GlobalTheme;
  dark: GlobalTheme;
  light: GlobalTheme;
}

const initialState:InitialState ={
  light: light,
  dark:  dark,
  theme:  light,
  paperTheme: lightPaper
}

const thmeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state,action) => {
      state.theme = action.payload;
    },
  },
})

export const { setTheme } = thmeSlice.actions;
export const themeReducer = thmeSlice.reducer;