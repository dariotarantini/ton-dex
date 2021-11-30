import IPair from "./IPair";
import TransactionType from "./TransactionType";

export default interface ITransaction {
  amount: number
  type: TransactionType
  txid: string
  pair: IPair
  timestamp: Date
}