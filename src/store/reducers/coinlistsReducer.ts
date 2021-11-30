import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import ICoin from '../../api/types/ICoin';
import ICoinList from '../../api/types/ICoinList';

import { RootState } from '../store';

export interface CoinListsState {
  suggestions?: ICoin[]
  coinlists?: ICoinList[]

  sources: string[]
  custom: ICoin[]
};

const initialState: CoinListsState = {
  suggestions: undefined,
  coinlists: undefined,
  sources: [
    '' // default coinlist source link
  ],
  custom: []
};

export const coinlistsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setCoinlists: (state, action: PayloadAction<ICoinList[] | undefined>) => {
      state.coinlists = action.payload;
    },
    setSuggestions: (state, action: PayloadAction<ICoin[] | undefined>) => {
      state.suggestions = action.payload;
    },
    addCoinlistSource: (state, action: PayloadAction<string>) => {
      if (!state.sources.includes(action.payload)) {
        state.sources.push(action.payload);
      }
    },
    removeCoinlistSource: (state, action: PayloadAction<string>) => {
      const i = state.sources.indexOf(action.payload);

      if (i !== -1) {
        state.sources.splice(i, 1);
      }
    },
    addCustomCoin: (state, action: PayloadAction<ICoin>) => {
      for (let c of state.custom) {
        if (c.contract === action.payload.contract) {
          return;
        }
      }
      state.custom.push(action.payload);
    },
    removeCustomCoin: (state, action: PayloadAction<ICoin>) => {
      // TODO
    }
  }
});

export const {
  addCoinlistSource,
  removeCoinlistSource,
  setCoinlists,
  setSuggestions
} = coinlistsSlice.actions;

export const selectCoinlists = (state: RootState) => state.coinlists.coinlists;
export const selectSuggestions = (state: RootState) => state.coinlists.suggestions;

export const selectCoinlistSources = (state: RootState) => state.coinlists.sources;
export const selectCustomCoins = (state: RootState) => state.coinlists.custom;

export default coinlistsSlice.reducer;