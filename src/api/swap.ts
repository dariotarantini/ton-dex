import type IPair from "./types/IPair";
import type ITransaction from "./types/ITransaction";

import TransactionType from "./types/TransactionType";

/**
 * swap 2 tokens
 * 
 * @param {{ pair: IPair, amount: number }} props
 * 
 * @returns {ITransaction} 
 */
export async function swap({ pair, amount }: { pair: IPair, amount: number }): Promise<ITransaction> {
  // throw error if false

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  await wait(1000);

  return {
    amount,
    pair,
    timestamp: new Date(Date.now()),
    txid: '',
    type: TransactionType.SWAP
  };
}