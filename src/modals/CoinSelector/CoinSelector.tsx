import { useCallback, useEffect, useState } from 'react';

import { selectCoinlists, selectCustomCoins, selectSuggestions } from '../../store/reducers/coinlistsReducer';
import { useAppSelector } from '../../store/hooks';

import ICoin from '../../api/types/ICoin';

import Modal from '../../components/Modal/Modal';
import Coin from './Coin/Coin';
import List from './List/List';

import './CoinSelector.css';

type props = {
  isShowing: boolean
  toggle: (b?: boolean) => void
  disallowedCoins?: ICoin[]
  selected?: ICoin
  setSelected: (c: ICoin) => void
}

export default function CoinSelector({
  isShowing,
  toggle,
  disallowedCoins,
  selected,
  setSelected
}: props) {
  const [coinSelector, setCoinSelector] = useState<boolean>(true);

  const coinlists = useAppSelector(selectCoinlists);
  const suggestions = useAppSelector(selectSuggestions);
  const custom = useAppSelector(selectCustomCoins);

  useEffect(() => !isShowing ? setCoinSelector(true) : undefined, [isShowing]);

  const buildCoinlist = useCallback(() => {
    if (!coinlists) return [];

    let list: ICoin[] = [];
  
    coinlists.forEach(l => list = [ ...list, ...(l.coins) ])
  
    return (
      custom
        ? [ ...list, ...custom ]
        : list
    );
  }, [coinlists, custom]);

  return (
    <Modal
      isShowing={isShowing}
      toggle={toggle}
    >
      <div className="coin_selector">
        {coinlists ? (
          coinSelector ? (
            <Coin
              toggle={toggle}
              openCoinList={() => setCoinSelector(false)}
              showSources={false}

              selected={selected}
              select={c => {
                setSelected(c);
                toggle();
              }}

              coinList={buildCoinlist()}
              disallowed={disallowedCoins}
              suggestions={suggestions}
            />
          ) : (
            <List
              toggle={toggle}
              openCoinSelector={() => setCoinSelector(true)}
              coinLists={coinlists}
              customCoins={custom}
            />
          )
        ) : null}
      </div>
    </Modal>
  );
}