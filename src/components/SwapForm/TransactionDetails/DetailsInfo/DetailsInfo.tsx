import { useEffect, useState } from 'react';
import IPool from '../../../../api/types/IPool';

import { useAppSelector } from '../../../../store/hooks';
import { selectDeadline, selectSlippage } from '../../../../store/reducers/settingsReducer';

import stringifyNumber from '../../../../utils/stringifyNumber';
import stringifyPercentage from '../../../../utils/stringifyPercentage';

import './DetailsInfo.css';

type props = {
  pool: IPool
  reversed: boolean
  amount: number
  priceImpact?: number
};

export default function DetailsInfo({ pool, reversed, priceImpact, amount }: props) {
  const slippage = useAppSelector(selectSlippage);
  const deadline = useAppSelector(selectDeadline);

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

  return (
    <div className="transaction_details__info popup_shadow border_separator">
      <h5>Transaction details</h5>

      <div className="transaction_details__item">
        <span className="title">LP fee</span>
        <span>{stringifyNumber(pool.fee * amount / (10 ** from.decimals))} {from.ticker}</span>
      </div>

      {typeof priceImpact !== 'undefined' ? (
        <div className="transaction_details__item">
          <span className="title">Price impact</span>
          <span>{stringifyPercentage(priceImpact)}%</span>
        </div>
      ) : null}

      <div className="transaction_details__item">
        <span className="title">Allowed slippage</span>
        <span>{slippage}%</span>
      </div>

      <div className="transaction_details__item">
        <span className="title">Deadline</span>
        <span>{deadline} minutes</span>
      </div>

      <div className="transaction_details__item">
        <span className="title">Minimum recieved</span>
        <span>{stringifyNumber(amount * pool.pair.rate[reversed ? 'backward' : 'forward'] / (10 ** from.decimals))} {to.ticker}</span>
      </div>

    </div>
  );
}