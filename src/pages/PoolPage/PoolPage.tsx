import type IPool from "../../api/types/IPool";
import type ITransaction from "../../api/types/ITransaction";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getLatestPoolTransactions, getPool } from '../../api/pool';

import PoolOverview from "../../components/Pool/Overview/Overview";
import PoolActions from "../../components/Pool/Actions/Actions";
import PoolCharts from "../../components/Pool/Charts/Charts";
import TransactionList from "../../components/TransactionList/TransactionList";
import ActionsMobile from "../../components/Pool/ActionsMobile/ActionsMobile";

import { ReactComponent as NoPoolSVG } from '../../assets/images/noPool.svg';

import './PoolPage.css';

export default function PoolPage() {
  const { contract } = useParams();

  const [pool, setPool] = useState<IPool>();
  const [error, setError] = useState<string>();
  const [transactions, setTransactions] = useState<ITransaction[]>();
  const [timeframeIndex, setTimeframeIndex] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (!contract) {
      setError('pool not found');
      return;
    }

    (async () => {
      try {
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
      <div className="page page--error">
        <div className="page__content">
          <NoPoolSVG />
          <div className="page_error__text">
            <h2>Pool not found</h2>
            <button
              className="btn--secondary"
              onClick={() => navigate(-1)}
            >Go back</button>
          </div>
        </div>
      </div>
    );
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

        <ActionsMobile pool={pool} />

      </div>
    );
  } else {
    return <div className="page"></div>;
  }
}