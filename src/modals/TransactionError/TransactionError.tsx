import Modal from "../../components/Modal/Modal";

import { ReactComponent as TransactionFailedSVG } from '../../assets/images/transactionFailed.svg';

type props = {
  isShowing: boolean
  toggle: (b?: boolean) => void
}

export default function TransactionError({ isShowing, toggle }: props) {
  return (
    <Modal isShowing={isShowing} toggle={toggle}>
      <div className="transaction_sent">
        <TransactionFailedSVG />
        <h1>Transaction failed</h1>
        <button onClick={() => toggle(false)}>Close</button>
      </div>
    </Modal>
  );
}