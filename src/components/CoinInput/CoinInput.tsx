import type ICoin from "../../api/types/ICoin";

import { ChangeEventHandler } from 'react';

import stringifyNumber from '../../utils/stringifyNumber';
import useModal from '../../hooks/useModal';

import CoinIcon from "../CoinIcon/Coinlcon";
import CoinSelector from '../../modals/CoinSelector/CoinSelector';

import { ReactComponent as Arrow } from '../../assets/icons/arrow_bold.svg';

import './CoinInput.css';

type props = {
  balance?: number
  coin?: ICoin
  amount: number
  disallowed?: ICoin[]
  setCoin: (c: ICoin) => void
  setAmount: (n: number) => void
}

export default function CoinInput({
  balance,
  coin,
  amount,
  disallowed,
  setCoin,
  setAmount
}: props) {
  const { isShowing, toggle } = useModal();

  const update: ChangeEventHandler = e => {
    if (!coin) return;
    const pval = parseFloat((e.target as HTMLInputElement).value);
		setAmount(isNaN(pval) ? 0 : pval * (10 ** coin.decimals));
  };

  return (
    <>
      <CoinSelector
        isShowing={isShowing}
        toggle={toggle}
        disallowedCoins={disallowed ?? []}
        selected={coin}
        setSelected={setCoin}
      />

      <div className="coin__selector border_separator">

        <div className="coin_selector__coin">

          <div
            className={
              'coin__selected' +
              (balance !== undefined ? ' coin__selected--small border_separator' : '')
            }
            onClick={() => toggle()}
          >
            <CoinIcon coin={coin} />
            <span>{coin?.ticker ?? 'Select token'}</span>
            <Arrow />
          </div>

          {
            balance !== undefined
              ? <span onClick={() => setAmount(balance)}>Balance: {balance / (10 ** (coin?.decimals ?? 1))}</span>
              : null
          }

        </div>

        <input
          type="number"
          placeholder="0"
          value={amount ? +stringifyNumber(amount / (10 ** (coin?.decimals ?? 1))) : ''}
          onChange={update}
        />

      </div>
    </>
  );
}