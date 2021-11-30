import { useEffect, useState } from "react";

import { getLatestWalletTransactions } from "../../api/wallet";
import ITransaction from "../../api/types/ITransaction";

import { useAppSelector } from "../../store/hooks";
import { selectWallet } from "../../store/reducers/walletReducers";

import TransactionList from "../../components/TransactionList/TransactionList";

import './TransactionsPage.css';

export default function TransactionsPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  const [transactions, setTransactions] = useState<ITransaction[]>();

  const wallet = useAppSelector(selectWallet);

  useEffect(() => {
    setLoading(true);
    (async () => {
      if (!wallet) {
        setError('Connect wallet to see your transactions');
        setLoading(false);
      } else {
        try {
          setTransactions(await getLatestWalletTransactions());
          setError(undefined);
        } catch (e) {
          console.error(e);
          setError('ERROR: Cannot fetch wallet transactions');
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [wallet]);

  return (
    <div className="page page--transactions">
      <h3>Your transactions</h3>
      {
        loading ? (
          <div className="loader__circle"></div>
        ) : (
          error ? (
            <span className="error">{error}</span>
          ) : (
            transactions && transactions.length ? (
              <TransactionList
                transactions={transactions}
                pageSize={20}
              />
            ) : (
              <span className="error">You don't have any tracnsations yet</span>
            )
          )
        )
      }
    </div>
  );
}