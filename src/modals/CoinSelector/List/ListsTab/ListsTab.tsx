import { useEffect, useRef, useState } from "react";

export default function ListsTab() {
  const [link, setLink] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus(), []);

  return (
    <div className="coin_selector__tab">

      <div className="coin_selector__search">
        <input
          ref={inputRef}
          type="text"
          value={link}
          onChange={e => setLink(e.target.value)}
          placeholder="https:// or TON DNS"
        />
      </div>

      <div className="coin_selector_list__wrapper">
        <div className="coin_selector__list">
        </div>
      </div>

    </div>
  );
}