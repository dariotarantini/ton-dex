import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getLatestPoolTransactions, getPool } from '../../api/pool';
import IPool from "../../api/types/IPool";
import ITransaction from "../../api/types/ITransaction";

import PoolOverview from "../../components/Pool/Overview/Overview";
import PoolActions from "../../components/Pool/Actions/Actions";
import PoolCharts from "../../components/Pool/Charts/Charts";
import TransactionList from "../../components/TransactionList/TransactionList";

import './PoolPage.css';

export default function PoolPage() {
  const { contract } = useParams();

  const [pool, setPool] = useState<IPool>();
  const [error, setError] = useState<string>();
  const [transactions, setTransactions] = useState<ITransaction[]>();
  const [timeframeIndex, setTimeframeIndex] = useState<number>(0);

  useEffect(() => {
    (async () => {
      try {
        if (typeof contract === 'undefined') {
          setError('pool not found');
          return;
        }
        const pool = await getPool(contract);
        setPool(pool);
        setTransactions(await getLatestPoolTransactions(pool))
      } catch(e) {
        console.log(e);
        setError('pool not found');
      }
    })();
  }, [contract]);
  
  if (error) {
    return (
      <div className="pool page--pool">
        error: {error}
      </div>
    )
  }

  if (pool && transactions) {
    return (
      <div className="page page--pool">

        <PoolOverview pool={pool} />

        <PoolActions
          pool={pool}
          timeframeIndex={timeframeIndex}
          setTimeframeIndex={setTimeframeIndex}
        />

        <PoolCharts
          pool={pool}
          timeframe={timeframeIndex}
        />

        <h3 className="transactions_title">Transactions</h3>

        <TransactionList
          transactions={transactions}
        />

      </div>
    );
  } else {
    return <div className="page"></div>;
  }
}