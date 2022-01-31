import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export enum Theme {
  LIGHT,
  DARK,
  AUTO
}

export interface SettingsState {
  slippage: number
  deadline: number
  theme: Theme
};

const initialState: SettingsState = {
  slippage: .1,
  deadline: 30,
  theme: Theme.AUTO
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSlippage: (state, action: PayloadAction<number>) => {
      if (action.payload > 0 && action.payload <= 100) {
        state.slippage = action.payload;
      }
    },
    setDeadline: (state, action: PayloadAction<number>) => {
      if (action.payload > 0) {
        state.deadline = action.payload;
      }
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    }
  }
});

export const { setSlippage, setDeadline, setTheme } = settingsSlice.actions;

export const selectSlippage = (state: RootState) => state.settings.slippage;
export const selectDeadline = (state: RootState) => state.settings.deadline;
export const selectTheme = (state: RootState) => state.settings.theme;

export default settingsSlice.reducer;