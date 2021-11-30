import { useEffect, useState } from "react";

import { renderTime } from "../../utils/time";
import stringifyNumber from "../../utils/stringifyNumber";
import stringifyPercentage from "../../utils/stringifyPercentage";

import IPool from "../../api/types/IPool";

import Modal from "../../components/Modal/Modal";
import CoinIcon from "../../components/CoinIcon/Coinlcon";

import { ReactComponent as ArrowFull } from '../../assets/icons/arrow_full.svg';

import './SwapConfirmation.css';

type props = {
  reversed: boolean
  isShowing: boolean
  toggle: (b?: boolean) => void
  onConfirm: () => Promise<void> | void
  onDecline: () => Promise<void> | void
  details: {
    impact: number
    deadline: number
    pool: IPool
    amounts: {
      from: number
      to: number
    }
  }
}

function addMinutes(date: Date, mins: number) {
  return new Date(date.getTime() + mins * 60000);
}

export default function SwapConfirmation({ reversed, isShowing, toggle, details, onConfirm, onDecline }: props) {
  const calcDeadline = () => addMinutes(new Date(Date.now()), details.deadline);

  const [deadline, setDeadline] = useState<Date>(calcDeadline);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const updateInterval = setInterval(() => setDeadline(calcDeadline()), 500);
    return () => clearInterval(updateInterval);
    // eslint-disable-next-line
  }, []);

  return (
    <Modal
      isShowing={isShowing}
      toggle={(b?: boolean) => {
        if (!b) onDecline();
        toggle();
      }
    }>
      {loading ? (
        <div className="confirmation__loading">
          <div className="loader__wrapper">
            <div className="loader__circle"></div>
          </div>
        </div>
      ) : ''}
      <div
        className={
          'confirmation confirmation--swap' +
          (loading ? ' confirmation--loading' : '')
        }
      >
        <h4>Confirm swap</h4>
        <div className="swap_confirmation__pair">

          <div className="swap_confirmation__coin border_separator">
            <CoinIcon coin={details.pool.pair.from} />
            <span>{details.amounts.from} {details.pool.pair.from.ticker}</span>
          </div>

          <ArrowFull />

          <div className="swap_confirmation__coin border_separator">
            <CoinIcon coin={details.pool.pair.to} />
            <span>{details.amounts.to} {details.pool.pair.to.ticker}</span>
          </div>

        </div>

        <div className="confirmation__details border_separator">

          <div className="confirmation__field">
            <span className="title">Price</span>
            <span>1 {details.pool.pair.from.ticker} = {stringifyNumber(details.pool.pair.rate[reversed ? 'backward' : 'forward'])} {details.pool.pair.to.ticker}</span>
          </div>

          <div className="confirmation__field">
            <span className="title">Minimum sent</span>
            <span>{details.amounts.to} {details.pool.pair.to.ticker}</span>
          </div>

          <div className="confirmation__field">
            <span className="title">Price impact</span>
            <span>{stringifyPercentage(details.impact)}%</span>
          </div>

          <div className="confirmation__field">
            <span className="title">LP fee</span>
            <span>{details.pool.fee * details.amounts.from} {details.pool.pair.from.ticker}</span>
          </div>

          <div className="confirmation__field">
            <span className="title">Deadline</span>
            <span>{renderTime(deadline)}</span>
          </div>

        </div>

        <div className="confirmation__buttons">
          <button
            onClick={async () => {
              setLoading(true);
              if (onConfirm) await onConfirm();
              setLoading(false);
            }}
          >Swap</button>
        </div>
      </div>
    </Modal>
  );
}