import formatNumber from "../../../utils/formatNumber"

import './ChartCard.css';

type props = {
  loading: boolean
  title: string
  selected: boolean
  updater: () => void
  info: {
    value: number
    change: number
  }
}

export default function ChartCard({ title, info, selected, updater }: props) {
  return (
    <div
      className={
        'pool_chart__card border_separator' +
        (selected ? ' pool_chart__card--selected' : '')
      }
      onMouseEnter={updater}
    >
      <div className="pool_card_title__wrapper">
        <span className="pool_card__title">{title}</span>
        <span
          className={
            'pool_card__change' +
            (
              info.change > 0
                ? ' pool_card__change--inc'
                : info.change < 0
                  ? ' pool_card__change--dec'
                  : ''
            )
          }
        >{formatNumber(info.change)}%</span>
      </div>
      <span className="pool_card__value">{formatNumber(info.value)}</span>
      <span
          className={
            'pool_card__change pool_card__change--mobile' +
            (
              info.change > 0
                ? ' pool_card__change--inc'
                : info.change < 0
                  ? ' pool_card__change--dec'
                  : ''
            )
          }
        >{formatNumber(info.change)}%</span>
    </div>
  );
}