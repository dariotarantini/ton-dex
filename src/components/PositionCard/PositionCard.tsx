import { Link, useNavigate } from "react-router-dom";

import IPosition from "../../api/types/IPosition";
import stringifyNumber from "../../utils/stringifyNumber";
import CoinIcon from "../CoinIcon/Coinlcon";

import './PositionCard.css';

type props = {
  position: IPosition
}

const trim = (address: string) => `${address.slice(0, 6)}...${address.slice(-5)}`;

export default function PositionCard({ position }: props) {
  const navigate = useNavigate();
  return (
    <div className="pool_position__wrapper">

      <Link to={`/pool/${position.contract}`} className="pool_position__icons">
        <CoinIcon coin={position.pair.from} />
        <CoinIcon coin={position.pair.to} />
      </Link>

      <div className="pool_position border_separator">

        <Link to={`/pool/${position.contract}`} className="pool_position__title">
          <h2>{position.pair.from.ticker} ~ {position.pair.to.ticker}</h2>
          <span>{trim(position.contract)}</span>
        </Link>

        <div className="pool_position__props">

          <div className="pool_position__prop">
            <span className="pool_position_prop__title">LP tokens</span>
            <span className="pool_position_prop__value">{stringifyNumber(position.tokens / (10 ** position.decimals))}</span>
          </div>

          <div className="pool_position__prop">
            <span className="pool_position_prop__title">{position.pair.from.ticker}</span>
            <span className="pool_position_prop__value">{stringifyNumber(position.amount.from / (10 ** position.pair.from.decimals))} {position.pair.from.ticker}</span>
          </div>

          <div className="pool_position__prop">
            <span className="pool_position_prop__title">{position.pair.to.ticker}</span>
            <span className="pool_position_prop__value">{stringifyNumber(position.amount.to / (10 ** position.pair.to.decimals))} {position.pair.to.ticker}</span>
          </div>

          <div className="pool_position__prop">
            <span className="pool_position_prop__title">Pool share</span>
            <span className="pool_position_prop__value">{position.share}%</span>
          </div>

        </div>

        <div className="pool_position__buttons">
          <button
            className="btn--secondary btn--danger"
            onClick={() => navigate(`/remove/${position.contract}`)}
          >Remove</button>
        </div>

      </div>
    </div>
  );
}