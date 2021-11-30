import { useEffect } from "react";

import CoinInput from '../CoinInput/CoinInput';

import { ReactComponent as ArrowFull } from '../../assets/icons/arrow_full.svg';

import ICoin from "../../api/types/ICoin";

import './PairInput.css';

type props = {
  reversed?: boolean
  setReversed?: (b: boolean) => void

  rate: number

  from?: ICoin
  fromAmount: number
  fromBalance?: number
  to?: ICoin
  toAmount: number
  toBalance?: number

  setFrom: (c?: ICoin) => void
  setTo: (c?: ICoin) => void
  setFromAmount: (n: number) => void
  setToAmount: (n: number) => void
};

export default function PairInput({
  reversed,
  setReversed,

  rate,

  from,
  fromAmount,
  fromBalance,
  setFrom,
  setFromAmount,

  to,
  toAmount,
  toBalance,
  setTo,
  setToAmount,
}: props) {

  const updateFromAmount = (n: number) => {
    setFromAmount(n);
    if (from && to) {
      const a = n * rate;
      setToAmount(Math.round(a * 1000) / 1000);
    }
  }

  const updateToAmount = (n: number) => {
    setToAmount(n);
    if (from && to) {
      const a = rate > 0 ? n / rate : 0;
      setFromAmount(Math.round(a * 1000) / 1000);
    }
  }

  useEffect(() => {
    if (rate === 0) return;
    if (fromAmount === 0) updateToAmount(toAmount);
    else updateFromAmount(fromAmount);
    // eslint-disable-next-line
  }, [from, to, rate]);

  return (
    <div className="pair_input">
      <CoinInput
        disallowed={to ? [to] : undefined}
        balance={fromBalance}
        coin={from}
        setCoin={setFrom}
        amount={fromAmount}
        setAmount={updateFromAmount}
      />

      <div className="pair_input__arrow_wrapper">
        {(typeof reversed !== 'undefined' && typeof setReversed !== 'undefined') ? (
          <div
            className="pair_input__arrow"
            onClick={() => {
              const f = from;
              const fa = fromAmount;
              const ta = toAmount;
              setFrom(to ?? undefined);
              setTo(f ?? undefined);
              setFromAmount(ta);
              setToAmount(fa);
              setReversed(!reversed);
            }}
          >
            <ArrowFull />
          </div>
        ) : ''}
      </div>

      <CoinInput
        disallowed={from ? [from] : undefined}
        balance={toBalance}
        coin={to}
        setCoin={setTo}
        amount={toAmount}
        setAmount={updateToAmount}
      />
    </div>
  );
}