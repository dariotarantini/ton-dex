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

  const [from, setFrom] = useState(
    reversed
      ? details.pool.pair.to
      : details.pool.pair.from
  );
  const [to, setTo] = useState(
    reversed
      ? details.pool.pair.from
      : details.pool.pair.to
  );

  useEffect(() => {
    if (reversed) {
      setFrom(details.pool.pair.to);
      setTo(details.pool.pair.from);
    } else {
      setFrom(details.pool.pair.from);
      setTo(details.pool.pair.to);
    }
  }, [details, reversed]);

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
            <CoinIcon coin={from} />
            <span>{stringifyNumber(details.amounts.from / (10 ** from.decimals))} {from.ticker}</span>
          </div>

          <ArrowFull />

          <div className="swap_confirmation__coin border_separator">
            <CoinIcon coin={details.pool.pair.to} />
            <span>{stringifyNumber(details.amounts.to / (10 ** to.decimals))} {to.ticker}</span>
          </div>

        </div>

        <div className="confirmation__details border_separator">

          <div className="confirmation__field">
            <span className="confirmation_details__title">Price</span>
            <span>1 {from.ticker} = {stringifyNumber(details.pool.pair.rate[reversed ? 'backward' : 'forward'])} {to.ticker}</span>
          </div>

          <div className="confirmation__field">
            <span className="confirmation_details__title">Minimum sent</span>
            <span>{stringifyNumber(details.amounts.to / (10 ** to.decimals))} {to.ticker}</span>
          </div>

          <div className="confirmation__field">
            <span className="confirmation_details__title">Price impact</span>
            <span>{stringifyPercentage(details.impact)}%</span>
          </div>

          <div className="confirmation__field">
            <span className="confirmation_details__title">LP fee</span>
            <span>{stringifyNumber(details.pool.fee * details.amounts.from / (10 ** from.decimals))} {from.ticker}</span>
          </div>

          <div className="confirmation__field">
            <span className="confirmation_details__title">Deadline</span>
            <span>{renderTime(deadline)}</span>
          </div>

        </div>

        <button
          onClick={async () => {
            setLoading(true);
            if (onConfirm) await onConfirm();
            setLoading(false);
          }}
        >Swap</button>
      </div>
    </Modal>
  );
}