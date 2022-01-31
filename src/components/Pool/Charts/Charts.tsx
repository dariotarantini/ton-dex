import { useEffect, useState } from 'react';
import { getFiatRate } from '../../../api/coinlist';
import IPool from '../../../api/types/IPool';

import ChartTimeframe from '../../Chart/Timeframe';
import ChartCard from '../ChartCard/ChartCard';

import './Charts.css';

type props = {
  pool: IPool,
  timeframe: ChartTimeframe
}

export default function PoolCharts({ pool, timeframe }: props) {
  const [selected, setSelected] = useState(0);

  const [loading, setLoading] = useState<boolean>(true);
  const [fromRate, setFromRate] = useState<number>(0);
  const [toRate, setToRate] = useState<number>(0);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        setFromRate(await getFiatRate(pool.pair.from.contract));
        setToRate(await getFiatRate(pool.pair.to.contract));
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [pool]);

  return (
    <div className="pool__charts">

      <div className="pool__chart_selector">

        <ChartCard
          loading={loading}
          title="Volume"
          info={pool.info.volume}
          selected={selected === 0}
          updater={() => setSelected(0)}
        />

        <ChartCard
          loading={loading}
          title="TVL"
          info={{
            value: (pool.locked.from * fromRate) + (pool.locked.to * toRate),
            change: pool.info.tvl.change
          }}
          selected={selected === 1}
          updater={() => setSelected(1)}
        />

        <ChartCard
          loading={loading}
          title="Fees"
          info={pool.info.fees}
          selected={selected === 2}
          updater={() => setSelected(2)}
        />

      </div>

      <div className="pool__chart border_separator">
        {'// TODO ' + selected}
      </div>

    </div>
  );
}