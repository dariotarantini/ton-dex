import { useEffect, useRef, useState } from "react";

import ICoin from "../../../../api/types/ICoin";

import './TokensTab.css';

function renderCoinlist(customCoins: ICoin[]) {
  return (
    <div className="coin_selector__custom">
    </div>
  );
}

export default function TokensTab({ customCoins }: { customCoins?: ICoin[] }) {
  const [address, setAddress] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus(), []);

  return (
    <div className="coin_selector__tab">

      <div className="coin_selector__search">
        <input
          ref={inputRef}
          type="text"
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="Contract address"
        />
      </div>

      <div className="coin_selector__list">
        {
          customCoins && customCoins.length
            ? renderCoinlist(customCoins)
            : <span className="empty">No custom coins</span>
        }
      </div>

    </div>
  );
}