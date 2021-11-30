import { CoinListsState } from './reducers/coinlistsReducer';
import { SettingsState } from './reducers/settingsReducer';

import { store } from './store';

export function loadStore() {
  const settingsItem = localStorage.getItem('settings');
  const coinlistsItem = localStorage.getItem('coinlists');

  let state: {
    coinlists?: CoinListsState
    settings?: SettingsState
  } = {};

  try {
    state.coinlists = JSON.parse(coinlistsItem ?? '');
  } catch(e) {
    console.log('Loading default coinlist sources...');
  }

  try {
    state.settings = JSON.parse(settingsItem ?? '');
  } catch(e) {
    console.log('Loading default settings...');
  }

  return state;
}

export function syncStore() {
  store.subscribe(() => {
    localStorage.setItem('settings', JSON.stringify(store.getState().settings));
    localStorage.setItem('coinlists', JSON.stringify({
      sources: store.getState().coinlists.sources,
      custom: store.getState().coinlists.custom
    }));
  });
}