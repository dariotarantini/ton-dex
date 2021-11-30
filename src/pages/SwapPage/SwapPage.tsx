import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectFromAmount,
  selectToAmount,
  selectFrom,
  selectTo,
  setFrom,
  setTo,
  setFromAmount,
  setToAmount
} from "../../store/reducers/swapReducer";

import SwapForm from "../../components/SwapForm/SwapForm";

import { ReactComponent as Cog } from '../../assets/icons/cog.svg';

import ICoin from "../../api/types/ICoin";

export default function SwapPage() {
  const navigate = useNavigate();

  const from = useAppSelector(selectFrom);
  const to = useAppSelector(selectTo);
  const fromAmount = useAppSelector(selectFromAmount);
  const toAmount = useAppSelector(selectToAmount);

  const dispatch = useAppDispatch();

  return (
    <div className="page page--centered">

      <div className="card__title">
        <h4>Swap</h4>
        <Cog onClick={() => navigate('/settings')} />
      </div>

      <SwapForm
        from={from}
        to={to}
        fromAmount={fromAmount}
        toAmount={toAmount}

        setFrom={(c?: ICoin) => dispatch(setFrom(c))}
        setTo={(c?: ICoin) => dispatch(setTo(c))}
        setFromAmount={(n: number) => dispatch(setFromAmount(n))}
        setToAmount={(n: number) => dispatch(setToAmount(n))}
      />

    </div>
  )
}