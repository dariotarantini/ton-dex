import { useEffect, useState } from 'react';

import stringifyNumber from '../../../utils/stringifyNumber';
import { getFiatRate } from '../../../api/coinlist';
import IPool from '../../../api/types/IPool';

import { ReactComponent as Info } from '../../../assets/icons/info.svg';

import DetailsInfo from './DetailsInfo/DetailsInfo';

import './TransactionDetails.css';

type props = {
  pool: IPool
  reversed: boolean
  amount: number
  priceImpact?: number
};

export default function TransactionDetails({ pool, priceImpact, amount, reversed }: props) {
  const [isDetailsInfoShown, setDetailsInfoShown] = useState<boolean>(false);
  const [fiat, setFiat] = useState<number>();

  const [from, setFrom] = useState(
    reversed
      ? pool.pair.to
      : pool.pair.from
  );
  const [to, setTo] = useState(
    reversed
      ? pool.pair.from
      : pool.pair.to
  );

  useEffect(() => {
    if (reversed) {
      setFrom(pool.pair.to);
      setTo(pool.pair.from);
    } else {
      setFrom(pool.pair.from);
      setTo(pool.pair.to);
    }
  }, [pool, reversed]);

  useEffect(() => {
    (async () => {
      try {
        setFiat(await getFiatRate(pool.pair.from.contract));
      } catch (e) {
        console.error(e);
        setFiat(undefined);
      }
    })();
  }, [pool]);

  return (
    <div className="transaction_details">

      {isDetailsInfoShown ? (
        <DetailsInfo
          pool={pool}
          reversed={reversed}
          priceImpact={priceImpact}
          amount={amount}
        />
      ) : null}

      <span
        className="transaction__info"
        onMouseEnter={() => setDetailsInfoShown(true)}
        onMouseLeave={() => setDetailsInfoShown(false)}
      ><Info /></span>
      <span>1 {from.ticker} = {stringifyNumber(pool.pair.rate[reversed ? 'backward' : 'forward'])} {to.ticker}</span>
      {
        fiat
          ? <span className="transaction__fiat">(${stringifyNumber(fiat)})</span>
          : null
      }
    </div>
  );
}