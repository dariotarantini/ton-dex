import { store } from "../store/store";

import TransactionType from "./types/TransactionType";
import ITransaction from "./types/ITransaction";
import ICoin from "./types/ICoin";
import IWallet from "./types/IWallet";

/**
 * @async
 * @returns {IWallet} wallet
 */
export async function requestWallet(): Promise<IWallet> {
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  await wait(500);

  return {
    address: 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N'
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

  if (coin.ticker === 'TONCOIN') return 15000;
  if (coin.ticker === 'DAI') return 5000;
  if (coin.ticker === 'USDT') return 7500
  if (coin.ticker === 'WBTC') return 8.781593;

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
      amount: (Math.random() * 5000),
      pair: {
        rate: {
          forward: rate,
          backward: 1 / rate
        },
        from: {
          icon: '',
          ticker: 'TONCOIN',
          contract: 'toncoin'
        },
        to: {
          icon: '',
          ticker: 'DAI',
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
  requestWallet,
  getCoinBalance,
  getLatestWalletTransactions
};

export default api;