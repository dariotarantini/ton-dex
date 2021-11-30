import { store } from "../store/store";
import IPair from "./types/IPair";
import IPool from "./types/IPool";
import IPosition from "./types/IPosition";
import ITransaction from "./types/ITransaction";
import TransactionType from "./types/TransactionType";

/**
 * Get possible price impact of transaction
 * 
 * @async
 * 
 * @param {IPool} pool
 * @param {number} fromAmount
 * @returns {number}}
 */
export async function getPriceImpact(pool: IPool, fromAmount: number): Promise<number> {
  return 0.02;
}

/**
 * Get pool contract from token contracts
 * 
 * @async
 * 
 * @param {string} fromContract
 * @param {string} toContract
 * @returns {string} pool contract
 */
export async function getPoolContract(fromContract?: string, toContract?: string) {
  if (!(
    (fromContract === 'toncoin' && toContract === 'dai')
    || (fromContract === 'dai' && toContract === 'toncoin')
  )) throw new Error('pool not found');

  return 'poolcontract1';
}

/**
 * Get pool by contract
 * 
 * @async
 * 
 * @param {string} contract
 * @returns {IPool}
 */
export async function getPool(contract: string): Promise<IPool> {
  if (contract !== 'poolcontract1') throw new Error('pool not found');

  const pool = {
    contract: 'poolcontract1',
    fee: 0.05,
    locked: {
      from: 4_653_334,
      to: 17_450_000
    },
    info: {
      volume: {
        value: 86_200_000,
        change: 999.99
      },
      tvl: {
        change: -999.99,
        value: 441_260_000
      },
      fees: {
        value: 4_100_000,
        change: 999.99
      },
    },
    pair: {
      rate: {
        forward: 3.75,
        backward: 1 / 3.75
      },
      from: {
        ticker: 'TONCOIN',
        icon: '',
        contract: 'toncoin'
      },
      to: {
        ticker: 'DAI',
        icon: '',
        contract: 'dai'
      }
    }
  };

  return pool;
}

/**
 * Gets latest pool transactions
 * 
 * @async
 * 
 * @param {IPool} pool
 * @param {number} count 
 * @returns {ITransaction[]}
 */
export async function getLatestPoolTransactions(pool: IPool, count: number = 500): Promise<ITransaction[]> {
  if (!(
    (pool.pair.from.contract === 'toncoin' && pool.pair.to.contract === 'dai')
    || (pool.pair.from.contract === 'dai' && pool.pair.to.contract === 'toncoin')
  )) throw new Error('pool not found');

  if (count < 0) count = 0;

  const txTypes = [
    TransactionType.SWAP,
    TransactionType.ADD_LIQUIDITY,
    TransactionType.REMOVE_LIQUIDITY
  ];

  const tx = () => {
    const rate = 5 * Math.random();

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

/**
 * Get possible user share in the pool
 * 
 * @async
 * 
 * @param contract Pool contract
 * @param amounts Token amounts
 * @returns {{ amount: number, percentage: number }}
 */
export async function getPoolShare(contract: string, amounts: { from: number, to: number }) {
  if (contract !== 'poolcontract1') throw new Error('pool not found');
  return {
    amount: 0.000054,
    percentage: 0.0012
  };
}

/**
 * Create liquidity pool
 * 
 * @async
 * 
 * @param {IPair} pair Token pair
 * @param {{ from: number, to: number }} amounts 
 * @returns {ITransaction}
 */
export async function createPool(pair: IPair, amounts: { from: number, to: number }): Promise<ITransaction> {
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  await wait(1000);
  return {
    type: TransactionType.ADD_LIQUIDITY,
    timestamp: new Date(Date.now()),
    txid: '',
    pair,
    amount: 0
  };
}

/**
 * Add tokens to liquidity pool
 * 
 * @async
 * 
 * @param {string} contract Pool contract address
 * @param {{ from: number, to: number }} amounts Token amounts, provided by user
 * @returns {ITransaction}
 */
export async function addLiquidity(contract: string, amounts: { from: number, to: number }): Promise<ITransaction> {
  if (contract !== 'poolcontract1') throw new Error('pool not found');

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  await wait(1000);

  return {
    amount: 0,
    pair: {
      rate: {
        forward: 3.75,
        backward: 1 / 3.75
      },
      from: {
        ticker: 'TONCOIN',
        icon: '',
        contract: 'toncoin'
      },
      to: {
        ticker: 'DAI',
        icon: '',
        contract: 'dai'
      }
    },
    timestamp: new Date(Date.now()),
    txid: '',
    type: TransactionType.ADD_LIQUIDITY
  };
}

/**
 * get liquidity positions for current wallet
 * 
 * @async
 * @returns {IPosition[]}
 */
 export async function getLiquidityPositions(): Promise<IPosition[]> {
  const state = store.getState();

  if (!state.wallet.wallet) throw new Error('wallet not connected');

  const p = {
    pair: {
      from: {
        ticker: 'TONCOIN',
        icon: '',
        contract: 'toncoin'
      },
      to: {
        ticker: 'DAI',
        icon: '',
        contract: 'dai'
      },
      rate: {
        forward: 3.75,
        backward: 1 / 3.75
      }
    },
    contract: '',
    tokens: 0.000054,
    share: 0.0012,
    amount: {
      from: 100,
      to: 375,
    }
  };

  return Array.from({ length: 5 }, () => p);
}

/**
 * get liquidity positions for current wallet
 * 
 * @async
 * 
 * @returns {IPool[]}
 */
export async function getPopularPools() {
  const pool = await getPool('poolcontract1');
  return Array.from({ length: 100 }, () => pool);
}