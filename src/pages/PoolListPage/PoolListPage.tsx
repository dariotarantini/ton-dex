import { useEffect, useState } from "react";

import { useAppSelector } from "../../store/hooks";
import { selectWallet } from "../../store/reducers/walletReducers";

import { getLiquidityPositions, getPopularPools } from "../../api/pool";
import IPosition from "../../api/types/IPosition";
import IPool from "../../api/types/IPool";
import formatNumber from "../../utils/formatNumber";

import Table from "../../components/Table/Table";
import CoinIcon from "../../components/CoinIcon/Coinlcon";

import './PoolListPage.css';
import { Link } from "react-router-dom";

export default function PoolListPage() {
  const wallet = useAppSelector(selectWallet);

  const [pools, setPools] = useState<IPool[]>();
  const [positions, setPositions] = useState<IPosition[]>();

  useEffect(() => {
    (async () => {
      if (!wallet) return;
      try {
        setPositions(await getLiquidityPositions());
      } catch(e) {
        setPositions(undefined);
      }
    })();
  }, [wallet]);

  useEffect(() => {
    (async () => {
      try {
        setPools(await getPopularPools());
      } catch(e) {
        setPools(undefined);
      }
    })();
  }, []);

  const rows = [
    {
      showOnMobile: true,
      title: 'Pool',
      alignRight: true,
      width: .6
    },
    {
      showOnMobile: true,
      title: 'TVL',
      width: .2
    },
    {
      showOnMobile: false,
      title: 'Volume (24h)',
      width: .2
    }
  ];

  return (
    <div className="page page--pools">
      <Link to="/add">ADD LIQUIDITY</Link>
      <Link to="/pool/poolcontract1"> POOL OVERVIEW</Link>

      {wallet ? (
        <>
          <h3>Your pools</h3>
          <Table
            cols={rows}
            rows={[]}
            defaultSorted={1}
            pageSize={10}
          />
        </>
      ) : ''}

      {pools ? (
        <>
          <h3>All pools</h3>
          <Table
            cols={rows}
            rows={pools.map((p, i) => [
            { key: i, rendered: (
                <div className="pools_list__item">
                  <div className="pools_list_item__icon">
                    <CoinIcon coin={p.pair.from} />
                    <CoinIcon coin={p.pair.to} />
                  </div>
                  <span>{p.pair.from.ticker} ~ {p.pair.to.ticker}</span>
                </div>
              )},
              { key: i, rendered: `$ ${formatNumber(p.info.tvl.value)}` },
              { key: i, rendered: `$ ${formatNumber(p.info.volume.value)}` }
            ])}
            defaultSorted={1}
            pageSize={10}
          />
        </>
      ) : ''}
    </div>
  )
}