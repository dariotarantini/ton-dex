import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

import api from '../../api/wallet';
import IWallet from '../../api/types/IWallet';

export interface WalletState {
  loading: boolean
  wallet?: IWallet
};

const initialState: WalletState = {
  loading: false,
  wallet: undefined
};

export const requestWallet = createAsyncThunk(
  'wallet/request',
  async () => (await api.requestWallet())
);

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    disconnectWallet: state => {
      state.wallet = undefined;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(requestWallet.pending, state => {
        state.loading = true;
      })
      .addCase(requestWallet.fulfilled, (state, action) => {
        state.wallet = action.payload;
        state.loading = false;
      })
  }
});

export const { disconnectWallet } = walletSlice.actions;

export const selectWallet = (state: RootState) => state.wallet.wallet;
export const selectWalletLoading = (state: RootState) => state.wallet.loading;

export default walletSlice.reducer;