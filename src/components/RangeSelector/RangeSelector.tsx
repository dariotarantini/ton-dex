import './RangeSelector.css';

type props = {
  value: number
  setValue: (n: number) => void
}

export default function RangeSelector({ value, setValue }: props) {
  return (
    <div className="range_selector">

      <div className="range_selector__input">

        <div
          className="range_selector_input__filled"
          style={{ width: `${value}%` }}
        ></div>
        
        <div
          className="range_selector_input__pointer"
          style={{ left: `${value}%` }}
        ></div>

        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={e => setValue(parseFloat(e.target.value))} 
        />
      </div>

      <div className="range_selector__actions">
        <div
          className="range_selector__action border_separator"
          onClick={() => setValue(25)}
        >25%</div>
        <div
          className="range_selector__action border_separator"
          onClick={() => setValue(50)}
        >50%</div>
        <div
          className="range_selector__action border_separator"
          onClick={() => setValue(75)}
        >75%</div>
        <div
          className="range_selector__action border_separator"
          onClick={() => setValue(100)}
        >Max</div>
      </div>
    </div>
  );
}