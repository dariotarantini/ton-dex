import { Link } from 'react-router-dom';

import { useAppDispatch } from '../../../store/hooks';
import { setFrom, setFromAmount, setTo, setToAmount } from '../../../store/reducers/swapReducer';
import {
  setFrom as setFromAdd ,
  setFromAmount as setFromAmountAdd,
  setTo as setToAdd,
  setToAmount as setToAmountAdd
} from '../../../store/reducers/addLiquidityReducer';

import IPool from '../../../api/types/IPool';

import './ActionsMobile.css';

type props = {
  pool: IPool
}

export default function ActionsMobile({ pool }: props) {
  const dispatch = useAppDispatch();

  return (
    <div className="pool__actions_mobile">
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
  );
}