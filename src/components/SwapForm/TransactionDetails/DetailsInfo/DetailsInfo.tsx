import IPool from '../../../../api/types/IPool';

import { useAppSelector } from '../../../../store/hooks';
import { selectDeadline, selectSlippage } from '../../../../store/reducers/settingsReducer';

import stringifyNumber from '../../../../utils/stringifyNumber';
import stringifyPercentage from '../../../../utils/stringifyPercentage';

import './DetailsInfo.css';

type props = {
  pool: IPool
  amount: number
  priceImpact?: number
};

export default function DetailsInfo({ pool, priceImpact, amount }: props) {
  const slippage = useAppSelector(selectSlippage);
  const deadline = useAppSelector(selectDeadline);

  return (
    <div className="transaction_details__info popup_shadow border_separator">
      <h5>Transaction details</h5>

      <div className="transaction_details__item">
        <span className="title">LP fee</span>
        <span>{pool.fee * amount} {pool.pair.from.ticker}</span>
      </div>

      {typeof priceImpact !== 'undefined' ? (
        <div className="transaction_details__item">
          <span className="title">Price impact</span>
          <span>{stringifyPercentage(priceImpact)}%</span>
        </div>
      ) : ''}

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
        <span>{stringifyNumber(amount * pool.pair.rate.forward)}</span>
      </div>

    </div>
  );
}