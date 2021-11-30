import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

import ICoin from '../../api/types/ICoin';

export interface AddLiquidityState {
  from?: ICoin
  to?: ICoin
  startingPrice: number
  amounts: {
    from: number
    to: number
  }
};

const initialState: AddLiquidityState = {
  startingPrice: 0,
  amounts: {
    from: 0,
    to: 0
  }
};

export const addLiquiditySlice = createSlice({
  name: 'addLiquidity',
  initialState,
  reducers: {
    setFrom: (state, action: PayloadAction<ICoin | undefined>) => {
      state.from = action.payload;
    },
    setTo: (state, action: PayloadAction<ICoin | undefined>) => {
      state.to = action.payload;
    },
    setFromAmount: (state, action: PayloadAction<number>) => {
      state.amounts.from = action.payload;
    },
    setToAmount: (state, action: PayloadAction<number>) => {
      state.amounts.to = action.payload;
    },
    setStartingPrice: (state, action: PayloadAction<number>) => {
      state.startingPrice = action.payload;
    }
  }
});

export const {
  setFrom,
  setTo,
  setFromAmount,
  setToAmount,
  setStartingPrice
} = addLiquiditySlice.actions;

export const selectFrom = (state: RootState) => state.addLiquidity.from;
export const selectTo = (state: RootState) => state.addLiquidity.to;
export const selectFromAmount = (state: RootState) => state.addLiquidity.amounts.from;
export const selectToAmount = (state: RootState) => state.addLiquidity.amounts.to;
export const selectStartingPrice = (state: RootState) => state.addLiquidity.startingPrice;

export default addLiquiditySlice.reducer;