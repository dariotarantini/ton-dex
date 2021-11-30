import { useEffect, useState } from 'react';

import { selectCoinlists, selectCustomCoins, selectSuggestions } from '../../store/reducers/coinlistsReducer';
import { useAppSelector } from '../../store/hooks';

import ICoin from '../../api/types/ICoin';
import ICoinList from '../../api/types/ICoinList';

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

function buildCoinlist(lists: ICoinList[], custom?: ICoin[]) {
  let list: ICoin[] = [];

  lists.forEach(l => list = [ ...list, ...(l.coins) ])

  return (
    custom
      ? [ ...list, ...custom ]
      : list
  );
}

export default function CoinSelector({
  isShowing,
  toggle,
  disallowedCoins,
  selected,
  setSelected
}: props) {
  const [coinSelector, setCoinSelector] = useState<boolean>(true);

  // const sources = useAppSelector(selectCoinlistSources);
  const coinlists = useAppSelector(selectCoinlists);
  const suggestions = useAppSelector(selectSuggestions);
  const custom = useAppSelector(selectCustomCoins);

  useEffect(() => !isShowing ? setCoinSelector(true) : undefined, [isShowing]);

  return (
    <Modal
      isShowing={isShowing}
      toggle={toggle}
    >
      <div className="coin_selector">
        {
          coinlists ? (
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
  
                coinList={buildCoinlist(coinlists, custom)}
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
          ) : ''
        }
      </div>
    </Modal>
  );
}