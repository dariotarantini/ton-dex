import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { getFiatRate } from '../../api/coin';
import TransactionType from '../../api/types/TransactionType';
import ITransaction from '../../api/types/ITransaction';
import IColumnTemplate from '../Table/IColumnTemplate';

import { since } from '../../utils/time';
import formatNumber from '../../utils/formatNumber';

import Selector from '../Selector/Selector';
import Table from '../Table/Table';

import './TransactionList.css';

function renderSelector(
  options: string[],
  selected: number,
  updater: Dispatch<SetStateAction<number>>
): JSX.Element {
  return (
    <div className="pool__transactions_selector">
      <Selector
        options={options}
        selected={selected}
        updater={updater}
      />
    </div>
  )
}

function renderTxType(tx: ITransaction): JSX.Element {
  switch (tx.type) {
    case TransactionType.SWAP: {
      return (
        <a href="https://ton.sh/" target="_blank" rel="noreferrer">Swap {tx.pair.from.ticker} for {tx.pair.to.ticker}</a>
      );
    }
    case TransactionType.ADD_LIQUIDITY: {
      return (
        <a href="https://ton.sh/" target="_blank" rel="noreferrer">Add liquidity</a>
      );
    }
    case TransactionType.REMOVE_LIQUIDITY: {
      return (
        <a href="https://ton.sh/" target="_blank" rel="noreferrer">Remove liquidity</a>
      );
    }
  }
}

const filterOptions = [
  'All',
  'Swaps',
  'Adds',
  'Removes'
];

const txTypes = [
  TransactionType.SWAP,
  TransactionType.ADD_LIQUIDITY,
  TransactionType.REMOVE_LIQUIDITY
];

type props = {
  transactions: ITransaction[]
  pageSize?: number
}

export default function TransactionList({ transactions, pageSize }: props) {
  const pair = transactions[0].pair;

  const [filter, setFilter] = useState<number>(0);
  const [fiatRate, setFiatRate] = useState<number>(0);

  useEffect(() => {
    (async () => {
      try {
        setFiatRate(await getFiatRate(pair.to.contract));
      } catch (e) {
        console.error(e);
        setFiatRate(0);
      }
    })()
  }, [pair]);

  const cols: IColumnTemplate[] = [
    {
      title: renderSelector(filterOptions, filter, setFilter),
      width: .36,
      showOnMobile: true
    },
    {
      title: `${pair.from.ticker} Amount`,
      width: .17,
      showOnMobile: false
    },
    {
      title: `${pair.to.ticker} Amount`,
      width: .17,
      showOnMobile: false
    },
    {
      title: 'Value',
      width: .15,
      showOnMobile: false
    },
    {
      title: 'Time',
      width: .15,
      showOnMobile: true
    }
  ];

  const filteredTransactions = (
    filter === 0
      ? transactions
      : transactions.filter(tx => tx.type === txTypes[filter - 1])
  );

  const renderTransaction = (tx: ITransaction) => {
    const toAmount = tx.amount * tx.pair.rate.forward;
    const value = toAmount * fiatRate;

    return [
      { key: -1, rendered: renderTxType(tx) },
      { key: tx.amount, rendered: `${formatNumber(tx.amount)} ${tx.pair.from.ticker}` },
      { key: toAmount, rendered: `${formatNumber(toAmount)} ${tx.pair.to.ticker}` },
      { key: value, rendered: `$ ${formatNumber(value)}` },
      { key: tx.timestamp.getTime(), rendered:  since(tx.timestamp) }
    ];
  }

  return (
    <div className="transaction_list">
      <Table
        cols={cols}
        rows={filteredTransactions.map(tx => renderTransaction(tx))}
        pageSize={pageSize ?? 10}
        defaultSorted={4}
      />
    </div>
  );
}