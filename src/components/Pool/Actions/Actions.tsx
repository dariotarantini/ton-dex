import { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';

import IPool from '../../../api/types/IPool';

import { setFrom, setFromAmount, setTo, setToAmount } from '../../../store/reducers/swapReducer';
import { useAppDispatch } from '../../../store/hooks';
import {
  setFrom as setFromAdd ,
  setFromAmount as setFromAmountAdd,
  setTo as setToAdd,
  setToAmount as setToAmountAdd
} from '../../../store/reducers/addLiquidityReducer';

import Selector from '../../Selector/Selector';

import './Actions.css';

export default function PoolActions({
  pool,
  timeframeIndex,
  setTimeframeIndex
}: {
  pool: IPool
  timeframeIndex: number,
  setTimeframeIndex: Dispatch<SetStateAction<number>>
}) {
  const dispatch = useAppDispatch();

  return (
    <div className="pool__actions">

      <div className="pool__buttons">

        <Link to="/">
          <button
            onClick={() => {
              dispatch(setFrom(pool.pair.from));
              dispatch(setTo(pool.pair.to));
              dispatch(setFromAmount(0));
              dispatch(setToAmount(0));
            }}
          >Swap</button>
        </Link>

        <Link to="/add">
          <button
            className="btn--secondary"
            onClick={() => {
              dispatch(setFromAdd(pool.pair.from));
              dispatch(setToAdd(pool.pair.to));
              dispatch(setFromAmountAdd(0));
              dispatch(setToAmountAdd(0));
            }}
          >Add liquidity</button>
        </Link>

      </div>

      <div className="pool__timeframes">
        <Selector
          options={['1H', '1D', '1W', '1M']}
          selected={timeframeIndex}
          updater={setTimeframeIndex}
        />
      </div>

    </div>
  );
}