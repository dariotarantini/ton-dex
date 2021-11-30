import { useEffect, useState } from 'react';

import { getFiatRate } from '../../../api/coin';
import IPool from '../../../api/types/IPool';

import { ReactComponent as Info } from '../../../assets/icons/info.svg';
import stringifyNumber from '../../../utils/stringifyNumber';
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
          priceImpact={priceImpact}
          amount={amount}
        />
      ) : ''}

      <span
        className="transaction__info"
        onMouseEnter={() => setDetailsInfoShown(true)}
        onMouseLeave={() => setDetailsInfoShown(false)}
      ><Info /></span>
      <span>1 {pool.pair.from.ticker} = {stringifyNumber(pool.pair.rate[reversed ? 'backward' : 'forward'])} {pool.pair.to.ticker}</span>
      {
        fiat
          ? <span className="transaction__fiat">(${stringifyNumber(fiat)})</span>
          : ''
      }
    </div>
  );
}