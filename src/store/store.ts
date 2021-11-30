import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import coinlistsReducer from './reducers/coinlistsReducer';
import settingsReducer from './reducers/settingsReducer';
import swapReducer from './reducers/swapReducer';

import { syncStore, loadStore } from './localStorage';
import walletReducers from './reducers/walletReducers';
import addLiquidityReducer from './reducers/addLiquidityReducer';

export const store = configureStore({
  preloadedState: loadStore(),
  reducer: {
    addLiquidity: addLiquidityReducer,
    wallet: walletReducers,
    coinlists: coinlistsReducer,
    settings: settingsReducer,
    swap: swapReducer
  }
});

syncStore();

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
