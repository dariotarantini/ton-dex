import type IPosition from "../../api/types/IPosition";

import stringifyNumber from "../../utils/stringifyNumber";
import useLoading from '../../hooks/useLoading';

import Modal from "../../components/Modal/Modal";
import CoinIcon from "../../components/CoinIcon/Coinlcon";

import { ReactComponent as ArrowFull } from '../../assets/icons/arrow_full.svg';

type props = {
  isShowing: boolean
  toggle: (b?: boolean) => void
  position: IPosition
  tokens: number
  fromAmount: number
  toAmount: number

  onConfirm?: () => Promise<void> | void
  onDecline?: () => Promise<void> | void
}

export default function RemoveLiquidityConfirmation({
  isShowing,
  toggle,
  position,
  tokens,
  fromAmount,
  toAmount,
  onConfirm,
  onDecline
}: props) {
  const { loading, setLoading } = useLoading(false);

  return (
    <Modal
      isShowing={isShowing}
      toggle={(b?: boolean) => {
        if (!b && onDecline) onDecline();
        toggle(b);
      }}
    >
      {loading ? (
        <div className="confirmation__loading">
          <div className="loader__wrapper">
            <div className="loader__circle"></div>
          </div>
        </div>
      ) : null}

      <div
        className={
          'confirmation confirmation--swap' +
          (loading ? ' confirmation--loading' : '')
        }
      >
        <h4>Confirm</h4>

        <div className="swap_confirmation__pair">

          <div className="add_liquidity_confirmation__info">
            <h1>{tokens / (10 ** position.pair.from.decimals)}</h1>
            <span>{position.pair.from.ticker} ~ {position.pair.to.ticker} Pool Tokens</span>
          </div>

          <ArrowFull />

          <div className="swap_confirmation__coin border_separator">
            <CoinIcon coin={position.pair.from} />
            <span>{stringifyNumber(fromAmount)} {position.pair.from.ticker}</span>
          </div>

          <div className="swap_confirmation__coin border_separator">
            <CoinIcon coin={position.pair.to} />
            <span>{stringifyNumber(toAmount)} {position.pair.to.ticker}</span>
          </div>

        </div>

        <button
          onClick={async () => {
            setLoading(true);
            if (onConfirm) await onConfirm();
            setLoading(false);
          }}
        >Confirm</button>

      </div>
    </Modal>
  );
}