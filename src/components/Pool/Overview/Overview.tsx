import IPool from "../../../api/types/IPool";
import CoinIcon from "../../CoinIcon/Coinlcon";
import PriceCard from "../PriceCard/PriceCard";

import './Overview.css';

export default function PoolOverview({ pool }: { pool: IPool}) {
  return (
    <div className="pool__overview">

      <div className="pool__pair">

        <div className="pool__icons">
          <div className="pool__icon pool__icon--from">
            <CoinIcon coin={pool?.pair.from} />
          </div>
          <div className="pool__icon pool__icon--to">
            <CoinIcon coin={pool?.pair.from} />
          </div>
        </div>

        <div className="pool__ticker">
          <span className="pool__symbol">{pool?.pair.from.ticker}</span>
          <span className="pool__symbol pool__symbol--separator">~</span>
          <span className="pool__symbol">{pool?.pair.to.ticker}</span>
        </div>

      </div>

      <div className="pool__price">
        <PriceCard pair={pool.pair}/>
      </div>

    </div>
  )
}