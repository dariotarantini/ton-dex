import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface SettingsState {
  slippage: number
  deadline: number
};

const initialState: SettingsState = {
  slippage: .1,
  deadline: 30
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
    }
  }
});

export const { setSlippage, setDeadline } = settingsSlice.actions;

export const selectSlippage = (state: RootState) => state.settings.slippage;
export const selectDeadline = (state: RootState) => state.settings.deadline;

export default settingsSlice.reducer;