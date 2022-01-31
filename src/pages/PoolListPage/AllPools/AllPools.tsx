import type IPool from '../../../api/types/IPool';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import useLoading from '../../../hooks/useLoading';
import useMobile from '../../../hooks/useMobile';
import formatNumber from '../../../utils/formatNumber';
import { getPopularPools } from '../../../api/pool';

import Table from '../../../components/Table/Table';
import CoinIcon from '../../../components/CoinIcon/Coinlcon';

import { ReactComponent as NotFoundSVG } from '../../../assets/images/notFound.svg';

import './AllPools.css';

export default function AllPools() {
  const {preloading, loading, setLoading} = useLoading();
  const [error, setError] = useState(false);

  const [pools, setPools] = useState<IPool[]>();

  const isMobile = useMobile();

  useEffect(() => {
    (async () => {
      try {
        setPools(await getPopularPools());
      } catch(e) {
        console.error(e);
        setPools(undefined);
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line
  }, []);

  if (preloading && loading) return null;

  if (loading) {
    return (
      <div className="pools pools--loading all_pools">
        <div className="loader__wrapper">
          <div className="loader__circle loader__circle--big"></div>
        </div>
      </div>
    );
  }

  if (error || !pools || !pools.length) {
    return (
      <div className="page__content page__content--empty page__content--all_pools">
        <NotFoundSVG />
        <div className="page_content__text">
          <h4>There's an error</h4>
          <p>We're solving it right now, so try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page__content page__content--all_pools">
      <h2>All pools</h2>
      <div className="all_pools">
        <Table
          cols={[
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
          ]}
          rows={pools.map((p, i) => [
          { key: i, rendered: (
              <Link
                to={`/pool/${p.contract}`}
                className="pools_list__item"
              >
                <div className="pools_list_item__icon">
                  <CoinIcon coin={p.pair.from} />
                  <CoinIcon coin={p.pair.to} />
                </div>
                <span>{`${p.pair.from.ticker} ~ ${p.pair.to.ticker}`}</span>
              </Link>
            )},
            { key: i, rendered: `$ ${formatNumber(p.info.tvl.value)}` },
            { key: i, rendered: `$ ${formatNumber(p.info.volume.value)}` }
          ])}
          defaultSorted={1}
          pageSize={isMobile ? 10 : 20}
        />
      </div>
    </div>
  );
}