import { useAppDispatch, useAppSelector } from "../../store/hooks";

import { connectWallet, selectWallet, selectWalletLoading } from "../../store/reducers/walletReducers";

type props = {
  actionText: string
  action: () => void
  loading?: boolean
  isPoolSelected?: boolean
  isPoolValid?: boolean
  isAmountValid?: boolean
  isBalanceValid?: boolean
  isStartingPriceValid?: boolean
}

export default function SendButton({
  actionText,
  action,
  loading,
  isPoolSelected,
  isPoolValid,
  isAmountValid,
  isBalanceValid,
  isStartingPriceValid
}: props) {
  const wallet = useAppSelector(selectWallet);
  const walletLoading = useAppSelector(selectWalletLoading);

  const dispatch = useAppDispatch();

  if (loading || walletLoading) {
    return (
      <button className="btn btn--secondary btn--unclickable">
        <div className="loader__circle"></div>
        <span>Loading...</span>
      </button>
    );
  }

  if (!wallet) {
    return (
      <button
        className="btn btn--secondary"
        onClick={() => dispatch(connectWallet())}
      >Connect Wallet</button>
    );
  }

  if (typeof isPoolSelected !== 'undefined' && !isPoolSelected) {
    return (
      <button className="btn--secondary btn--disabled">Select pair</button>
    );
  }

  if (typeof isPoolValid !== 'undefined' && !isPoolValid) {
    return (
      <button className="btn--secondary btn--disabled">Pool not found</button>
    );
  }

  if (typeof isAmountValid !== 'undefined' && !isAmountValid) {
    return (
      <button className="btn--secondary btn--disabled">Enter an amount</button>
    );
  }

  if (typeof isBalanceValid !== 'undefined' && !isBalanceValid) {
    return (
      <button className="btn--secondary btn--disabled">Insufficient balance</button>
    );
  }

  if (typeof isStartingPriceValid !== 'undefined' && !isStartingPriceValid) {
    return (
      <button className="btn--secondary btn--disabled">Enter starting price</button>
    );
  }

  return (
    <button onClick={action}>{actionText}</button>
  );
}