import type ITransaction from "./types/ITransaction";
import type ICoin from "./types/ICoin";
import type IWallet from "./types/IWallet";

import TransactionType from "./types/TransactionType";

import { store } from "../store/store";
import { connectWallet, disconnectWallet } from "../store/reducers/walletReducers";

declare global {
  interface Window { ton: any; }
}

export const provider =  window.ton;

provider?.on('accountsChanged', (accounts: string[]) => {
  if (!store.getState().wallet.wallet) return;

  if (accounts.length) {
    store.dispatch(connectWallet());
  } else {
    store.dispatch(disconnectWallet());
  }
});

/**
 * @async
 * @returns {number} TON balance
 */
async function getBalance(): Promise<number> {
  if (!store.getState().wallet.wallet) throw new Error('wallet not found');

  try {
    const balance = await provider.send('ton_getBalance');

    switch (typeof balance) {
      case 'number':
        return balance;
      case 'string':
        return 0;
      default:
        throw new Error('cannot get balance');
    }
  } catch (e) {
    throw e;
  }
}

/**
 * @async
 * @returns {IWallet} wallet
 */
export async function request(): Promise<IWallet> {
  if (!provider) {
    throw new Error('extension not found');
  }

  let wallet;

  try {
    wallet = await provider.send('ton_requestAccounts');
  } catch (e) {
    throw new Error('cannot get wallet');
  }

  if (!wallet[0]) throw new Error('wallet not found');

  return {
    address: wallet[0]
  };
}

/**
 * 
 * @param {ICoin} coin
 * @returns 
 */
export async function getCoinBalance(coin: ICoin): Promise<number | undefined> {
  if (coin.contract === '' || coin.contract === '') return;
  if (!store.getState().wallet.wallet) throw new Error('wallet not connected');

  if (coin.contract === 'toncoin') {
    try {
      const balance = await getBalance();
      return balance;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  // TODO: get token balance
  if (coin.contract === 'dai') return 5000 * 1000000000;
  if (coin.contract === 'usdt') return 7500 * 1000000000
  if (coin.contract === 'wbtc') return 8.781593 * 1000000000;

  return 0;
}

/**
 * @async
 * @param count linit transactions count
 * @returns 
 */
export async function getLatestWalletTransactions(count: number = 500): Promise<ITransaction[]> {
  // throw new Error('fetch error);
  const state = store.getState();

  if (!state.wallet.wallet) throw new Error('wallet not connected');

  if (count < 0) count = 0;

  const txTypes = [
    TransactionType.SWAP,
    TransactionType.ADD_LIQUIDITY,
    TransactionType.REMOVE_LIQUIDITY
  ];

  const tx = () => {
    const rate = 3.75 * Math.random();

    return {
      type: txTypes[Math.floor(Math.random() * 3)],
      txid: '',
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 10000000)),
      amount: (Math.random() * 5000 * 1000000000),
      pair: {
        rate: {
          forward: rate,
          backward: 1 / rate
        },
        from: {
          icon: '',
          ticker: 'TON',
          decimals: 9,
          contract: 'toncoin'
        },
        to: {
          icon: '',
          ticker: 'DAI',
          decimals: 9,
          contract: 'dai'
        }
      }
    };
  }

  // 500 demo rows
  if (count > 500) count = 500;

  return Array.from({ length: count }, () => tx());
}

const api = {
  request,
  getCoinBalance,
  getLatestWalletTransactions
};

export default api;