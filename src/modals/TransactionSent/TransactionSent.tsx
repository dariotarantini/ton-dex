import Modal from "../../components/Modal/Modal";

import ITransaction from "../../api/types/ITransaction";

import { ReactComponent as SendImage } from '../../assets/images/send.svg';
import TransactionType from "../../api/types/TransactionType";
import stringifyNumber from "../../utils/stringifyNumber";

import './TransactionSent.css';

type props = {
  isShowing: boolean
  rate?: number
  toggle: () => void
  transaction: ITransaction
};

export default function TransactionSent({ isShowing, rate, toggle, transaction }: props) {
  const renderText = () => {
    switch (transaction.type) {
      case TransactionType.SWAP:
        return (
          <p>Swapping <span>{
            stringifyNumber(transaction.amount)
          } {
            transaction.pair.from.ticker
          }</span> for <span>{
            typeof rate !== 'undefined' ? stringifyNumber(transaction.amount * rate) : ''
          } {
            transaction.pair.to.ticker
          }</span></p>
        );
      case TransactionType.ADD_LIQUIDITY:
        return (
          <p>Add liquidity for {transaction.pair.from.ticker} ~ {transaction.pair.to.ticker}</p>
        );
      case TransactionType.REMOVE_LIQUIDITY:
        return (
          <p>Remove liquidity from {transaction.pair.from.ticker} ~ {transaction.pair.to.ticker}</p>
        );
    }
  }

  return (
    <Modal isShowing={isShowing} toggle={toggle}>
      <div className="transaction_sent">
        <SendImage />
        <h1>Transaction sent</h1>
        {renderText()}
        <a
          href="https://ton.sh/"
          target="_blank"
          rel="noreferrer"
        >View transaction</a>
        <button onClick={toggle}>Done</button>
      </div>
    </Modal>
  );
}