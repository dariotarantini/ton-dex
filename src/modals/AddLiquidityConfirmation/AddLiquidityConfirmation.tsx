import { useState } from "react";

import IPair from "../../api/types/IPair";

import Modal from "../../components/Modal/Modal";

import stringifyNumber from "../../utils/stringifyNumber";
import stringifyPercentage from "../../utils/stringifyPercentage";

import './AddLiquidityConfirmation.css';

type props = {
  isShowing: boolean
  toggle: (b?: boolean) => void
  onConfirm?: () => Promise<void> | void
  onDecline?: () => Promise<void> | void

  share?: {
    amount: number
    percentage: number
  }

  pair: IPair
  amounts: {
    from: number
    to: number
  }
}

export default function AddLiquidityConfirmation({
  isShowing,
  toggle,
  onConfirm,
  onDecline,

  share,
  pair,
  amounts
}: props) {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Modal
      isShowing={isShowing}
      toggle={(b?: boolean) => {
        if (!b && onDecline) onDecline();
        toggle();
      }}
    >
      {loading ? (
        <div className="confirmation__loading">
          <div className="loader__wrapper">
            <div className="loader__circle"></div>
          </div>
        </div>
      ) : ''}

      <div className={
        'confirmation add_liquidity_confirmation' +
        (loading ? ' confirmation--loading' : '')
      }>
        {typeof share !== 'undefined'
          ? <h4>You will get</h4>
          : <h4>You will create</h4>
        }

        <div className="add_liquidity_confirmation__info">
          {typeof share !== 'undefined' ? (
            <>
              <h1>{share.amount}</h1>
              <span>{pair.from.ticker} ~ {pair.to.ticker} Pool Tokens</span>
            </>
          ) : (
            <>
              <h1>{pair.from.ticker} ~ {pair.to.ticker}</h1>
              <span>Liquidity Pool</span>
            </>
          )}
        </div>

        <div className="confirmation__details border_separator">

          <div className="confirmation__field">
            <span className="title">{pair.from.ticker} Deposited</span>
            <span>{stringifyNumber(amounts.from)}</span>
          </div>

          <div className="confirmation__field">
            <span className="title">{pair.to.ticker} Deposited</span>
            <span>{stringifyNumber(amounts.to)}</span>
          </div>

          <div className="confirmation__field">
            <span className="title">{pair.from.ticker} Rate</span>
            <span>{stringifyNumber(pair.rate.forward)}</span>
          </div>

          <div className="confirmation__field">
            <span className="title">{pair.to.ticker} Rate</span>
            <span>{stringifyNumber(pair.rate.backward)}</span>
          </div>

          {share ? (
            <div className="confirmation__field">
              <span className="title">Share of pool</span>
              <span>{stringifyPercentage(share.percentage)}%</span>
            </div>
          ) : ''}

        </div>

        <div className="confirmation__buttons">
          <button
            onClick={async () => {
              setLoading(true);
              if (onConfirm) await onConfirm();
              setLoading(false);
            }}
          >Confirm</button>
        </div>
      </div>
    </Modal>
  );
}