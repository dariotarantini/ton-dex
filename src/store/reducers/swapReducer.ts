import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

import ICoin from '../../api/types/ICoin';

export interface SwapState {
  from?: ICoin
  to?: ICoin
  amounts: {
    from: number
    to: number
  }
};

const defaultCoin: ICoin = {
  contract: 'toncoin',
  ticker: 'TON',
  decimals: 9,
  icon: ''
};

const initialState: SwapState = {
  from: defaultCoin,
  amounts: {
    from: 0,
    to: 0
  }
};

export const swapSlice = createSlice({
  name: 'swap',
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
  }
});

export const {
  setFrom,
  setTo,
  setFromAmount,
  setToAmount
} = swapSlice.actions;

export const selectFrom = (state: RootState) => state.swap.from;
export const selectTo = (state: RootState) => state.swap.to;
export const selectFromAmount = (state: RootState) => state.swap.amounts.from;
export const selectToAmount = (state: RootState) => state.swap.amounts.to;

export default swapSlice.reducer;