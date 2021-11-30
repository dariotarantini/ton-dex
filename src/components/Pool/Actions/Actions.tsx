import { Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';

import IPool from '../../../api/types/IPool';
import { useAppDispatch } from '../../../store/hooks';
import { setFrom, setFromAmount, setTo, setToAmount } from '../../../store/reducers/swapReducer';
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
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  function openSwap() {
    dispatch(setFrom(pool.pair.from));
    dispatch(setTo(pool.pair.to));
    dispatch(setFromAmount(0));
    dispatch(setToAmount(0));
    navigate('/');
  }

  return (
    <div className="pool__actions">

      <div className="pool__buttons">
        <button onClick={openSwap}>Swap</button>
        <button className="btn--secondary">Add liquidity</button>
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