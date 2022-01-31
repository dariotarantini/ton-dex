import Modal from "../../components/Modal/Modal";

import { useAppSelector } from "../../store/hooks";
import { selectWalletError, WalletError } from "../../store/reducers/walletReducers";

import { ReactComponent as InstallExtensionSVG } from '../../assets/images/installExtension.svg';

import './WalletErrorModal.css';

type props = {
  isShowing: boolean
  toggle: () => void
}

const getWalletLink = () => {
  // TODO: check for browser vendor
  return 'https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd';
}

export default function WalletErrorModal({ isShowing, toggle }: props) {
  const walletError = useAppSelector(selectWalletError);

  const renderWalletError = () => {
    switch (walletError) {
      case WalletError.NO_EXTENSION:
        return (
          <>
            <InstallExtensionSVG />
            <h1>Wallet not found</h1>
            <p>To use TON DEX, you should install our <a href={getWalletLink()} rel="noreferrer" target="_blank">web wallet</a>.</p>
          </>
        );
      case WalletError.NO_WALLET:
        return (
          <>
            <InstallExtensionSVG />
            <h1>Wallet not found</h1>
            <p>You must initialize your wallet before using it.</p>
          </>
        );
      case WalletError.GET_WALLET:
        return (
          <>
            <InstallExtensionSVG />
            <h1>Wallet not found</h1>
            <p>An error occurred while connecting to your wallet.</p>
          </>
        );
      case WalletError.UNKNOWN:
      default:
        return (
          <>
            <InstallExtensionSVG />
            <h1>Unknown error</h1>
            <p>That's all we know</p>
          </>
        );
    }
  }

  return (
    <Modal isShowing={isShowing} toggle={toggle}>
      <div className="wallet_error">
        {renderWalletError()}
        <button onClick={toggle}>Close</button>
      </div>
    </Modal>
  );
}