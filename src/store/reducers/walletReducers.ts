import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

import walletApi from '../../api/wallet';
import IWallet from '../../api/types/IWallet';

export enum WalletError {
  NO_EXTENSION,
  NO_WALLET,
  GET_WALLET,
  UNKNOWN
}

export interface WalletState {
  loading: boolean
  wallet?: IWallet
  error?: WalletError
};

const initialState: WalletState = {
  loading: false
};

export const connectWallet = createAsyncThunk(
  'wallet/request',
  async () => (await walletApi.request())
);

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    disconnectWallet: state => {
      state.wallet = undefined;
    },
    cleanWalletError: state => {
      state.error = undefined
    }
  },
  extraReducers: builder => {
    builder
      .addCase(connectWallet.pending, state => {
        state.loading = true;
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        state.wallet = action.payload;
        state.loading = false;
      })
      .addCase(connectWallet.rejected, (state, action) => {
        switch (action.error.message) {
          case 'extension not found':
            state.error = WalletError.NO_EXTENSION;
            break;
          case 'cannot get wallet':
            state.error = WalletError.GET_WALLET;
            break;
          case 'wallet not found':
            state.error = WalletError.NO_WALLET;
            break;
          default:
            state.error = WalletError.UNKNOWN;
        }

        disconnectWallet();
        state.loading = false;
      })
  }
});

export const { disconnectWallet, cleanWalletError } = walletSlice.actions;

export const selectWallet = (state: RootState) => state.wallet.wallet;
export const selectWalletLoading = (state: RootState) => state.wallet.loading;
export const selectWalletError = (state: RootState) => state.wallet.error;

export default walletSlice.reducer;