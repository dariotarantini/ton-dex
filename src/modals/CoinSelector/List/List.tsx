import { useEffect, useRef, useState } from 'react';

import Selector from '../../../components/Selector/Selector';
import ListsTab from './ListsTab/ListsTab';
import TokensTab from './TokensTab/TokensTab';

import { ReactComponent as Close } from '../../../assets/icons/close.svg';
import { ReactComponent as ArrowFull } from '../../../assets/icons/arrow_full.svg';

import ICoin from '../../../api/types/ICoin';
import ICoinList from '../../../api/types/ICoinList';

import './List.css';

type props = {
  toggle: () => void
  openCoinSelector: () => void
  coinLists: ICoinList[]
  customCoins?: ICoin[]
}

export default function List({ toggle, openCoinSelector, coinLists, customCoins }: props) {
  const [tab, setTab] = useState<number>(0);

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => searchRef.current?.focus(), []);

  return (
    <div className="coin_selector__coinlist">

      <div className="coin_selector__header">
        <div className="coin_selector__title">
          <div
            className="coin_selector__arrow"
            onClick={() => openCoinSelector()}
          >
            <ArrowFull />
          </div>
          <h2>Manage lists</h2>
        </div>
        <div
          className="coin_selector__arrow"
          onClick={() => toggle()}
        >
          <Close />
        </div>
      </div>

      {
        customCoins ? (
          <div className="coin_selector__tabs">
            <Selector
              options={['Lists', 'Tokens']}
              selected={tab}
              updater={setTab}
            />
          </div>
        ) : ''
      }

      <div className="coin_selector_tab__wrapper">
        {
          tab === 1
            ? <TokensTab customCoins={customCoins} />
            : <ListsTab />
        }
      </div>

    </div>
  );
}