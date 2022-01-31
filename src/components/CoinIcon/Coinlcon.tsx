import ICoin from "../../api/types/ICoin";

import './CoinIcon.css';

export default function CoinIcon({ coin }: { coin: ICoin | undefined }) {
  if (!coin || coin.icon === '') {
    return (
      <img
        src="/coin.svg"
        alt={coin ? coin.ticker : 'coin'}
        className="coin__icon"
      />
    );
  } else {
    return (
      <img
        src={coin.icon}
        alt={coin.ticker}
        className="coin__icon"
      />
    );
  }
}