import { ChangeEventHandler } from 'react';

import ICoin from '../../api/types/ICoin';

import './StartingPriceInput.css';

type props = {
	from: ICoin
	to: ICoin
	price: number
	setPrice: (n: number) => void
}

export default function StartingPriceInput({ price, setPrice, from, to }: props) {
  const updatePrice: ChangeEventHandler = e => {
  const pval = parseFloat((e.target as HTMLInputElement).value);
    setPrice(isNaN(pval) ? 0 : pval);
  };

  return (
    <div className="starting_input border_separator">
      <span>1 {from.ticker}<span className="equal">=</span></span>
      <input
        type="number"
        placeholder="0"
        value={price > 0 ? price : ''}	
        onChange={updatePrice}
      />
      <span className="to">{to.ticker}</span>
    </div>
  );
}