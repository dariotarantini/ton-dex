import { useEffect, useRef, useState } from 'react';

import { ReactComponent as ArrowFull } from '../../../assets/icons/arrow_full.svg';

import ICoin from '../../../api/types/ICoin';

import CoinIcon from '../../../components/CoinIcon/Coinlcon';
import Scrollable from '../../../components/Scrollable/Scrollable';

import './Coin.css';

type props = {
  toggle: () => void
  openCoinList: () => void
  showSources: boolean

  selected?: ICoin
  select: (c: ICoin) => void

  coinList: ICoin[]
  disallowed?: ICoin[]
  suggestions?: ICoin[]
}

export default function Coin({
  toggle,
  openCoinList,
  showSources,

  selected,
  select,

  coinList,
  disallowed,
  suggestions
}: props) {
  const [query, setQuery] = useState<string>('');

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => searchRef.current?.focus(), [])
  
  function isAllowed(c: ICoin): boolean {
    if (typeof disallowed === 'undefined') return true;

    for (let dc of disallowed) {
      if (dc.contract === c.contract) return false;
    }

    return true;
  }

  function renderSuggestions(list: ICoin[]) {
    return (
      <div className="modal_coin_selector__common">{
        list.map((c, i) => (
          <div
            key={i}
            onClick={() => isAllowed(c) ? select(c) : undefined}
            className={
              'modal_coin_selector__suggestion' +
              (c.contract === selected?.contract ? ' modal_coin_selector__suggestion--selected' : '') +
              (!isAllowed(c) ? ' modal_coin_selector__suggestion--disallowed' : '')
            }
          >
            <CoinIcon coin={c} />
            <span>{c.ticker}</span>
          </div>
        ))
      }</div>
    );
  }

  function renderCoinList(list: ICoin[]) {
    return list.map((c, i) => (
      <div
        key={i}
        className={
          'modal_coin_selector__item' +
          (c.contract === selected?.contract ? ' modal_coin_selector__item--selected' : '') +
          (!isAllowed(c) ? ' modal_coin_selector__item--disallowed' : '')
        }
        onClick={() => (isAllowed(c) && c.contract !== selected?.contract) ? select(c) : undefined}
      >
        <CoinIcon coin={c} />
        <span>{c.ticker}</span>
      </div>
    ));
  }

  function renderSearchResults(list: ICoin[]) {
    const filtered = coinList.filter(c => (
      c.ticker.toLowerCase().search(query.toLowerCase()) !== -1
      || c.contract.toLowerCase().search(query.toLowerCase()) !== -1
    ));

    if (filtered.length) return renderCoinList(filtered);

    return (
      <span className="modal_coin_selector__empty">Nothing found</span>
    );
  }

  return (
    <div className="modal_coin_selector__coin">

      <div className="modal_coin_selector__header">
        <div className="modal_coin_selector__title">
          <div
            className="modal_coin_selector__arrow"
            onClick={() => toggle()}
          >
            <ArrowFull />
          </div>
          <h2>Select token</h2>
        </div>
        {
          showSources
            ? <h2 className="link" onClick={openCoinList}>Manage lists</h2>
            : ''
        }
      </div>

      <div className="modal_coin_selector__search border_separator">
        <input
          type="text"
          ref={searchRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search name or paste address"
        />
      </div>

      <div className="modal_coin_selector__list">
        <Scrollable>
          {
            (
              suggestions
                && suggestions.length > 0
                && query === ''
            ) ? renderSuggestions(suggestions) : ''
          }
          {
            query === ''
              ? renderCoinList(coinList)
              : renderSearchResults(coinList)
          }
        </Scrollable>
      </div>

    </div>
  );
}