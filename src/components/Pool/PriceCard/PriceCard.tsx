import IPair from "../../../api/types/IPair";
import formatNumber from "../../../utils/formatNumber";
import CoinIcon from "../../CoinIcon/Coinlcon";

import './PriceCard.css';

export default function PriceCard({ pair }: { pair: IPair }) {
  return (
    <div className="pool__price_card border_separator">
      <div className="pool_price__rate">
        <CoinIcon coin={pair.from} />
        <span>1 {pair.from.ticker} = {formatNumber(pair.rate.forward)} {pair.to.ticker}</span>
      </div>
      <div className="pool_price__rate">
        <CoinIcon coin={pair.to} />
        <span>1 {pair.to.ticker} = {formatNumber(pair.rate.backward)} {pair.from.ticker}</span>
      </div>
    </div>
  );
}