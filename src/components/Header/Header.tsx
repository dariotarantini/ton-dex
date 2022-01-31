import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { connectWallet, disconnectWallet, selectWallet, selectWalletLoading } from "../../store/reducers/walletReducers";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

import Menu from "../Menu/Menu";

import './Header.css';

const trim = (address: string) => `${address.slice(0, 6)}...${address.slice(-5)}`;

let hideTimeout: NodeJS.Timeout;

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const wallet = useAppSelector(selectWallet);
  const walletLoading = useAppSelector(selectWalletLoading);

  const [isAddressMenuVisible, setAddressMenuVisible] = useState<boolean>(false);

  const addressMenuItems = [
    {
      title: 'Transactions',
      action: () => {
        navigate('/transactions');
        setAddressMenuVisible(false);
      }
    },
    {
      title: 'Disconnect',
      danger: true,
      action: () => {
        dispatch(disconnectWallet());
        setAddressMenuVisible(false);
      }
    }
  ];

  return (
    <header>

      <Link to="/" className="header__logo">
        <img src="/logo.svg" alt="TON DEX" />
        <span>TON DEX</span>
      </Link>

      <nav className="header__nav">

        <div id="nav__desktop" className="header__buttons">
          <Link to="/">
            <button className="btn--trinary">Swap</button>
          </Link>
          <Link to={wallet ? '/pool/your' : '/pool/all'}>
            <button className="btn--trinary">Pool</button>
          </Link>
        </div>

        <div id="nav__mobile" className="header__buttons header__buttons--mobile">
        {
          (
            location.pathname === '/'
            || location.pathname === '/settings'
          ) ? (
              <Link to={wallet ? '/pool/your' : '/pool/all'}>
                <button className="btn--trinary">Pool</button>
              </Link>
            ) : (
              <Link to="/">
                <button className="btn--trinary">Swap</button>
              </Link>
            )
        }
        </div>

        {
          wallet ? (
            <div className="address_menu">

              <button
                className="btn btn--secondary btn--unclickable"
                onTouchStart={() => {
                  clearTimeout(hideTimeout);
                  setAddressMenuVisible(true);
                }}
                onMouseEnter={() => {
                  clearTimeout(hideTimeout);
                  setAddressMenuVisible(true);
                }}
                onMouseLeave={() => hideTimeout = setTimeout(() => setAddressMenuVisible(false), 10)}
              >{trim(wallet.address)}</button>

              {isAddressMenuVisible ? (
                <div
                  className="address_menu__wrapper"
                  onMouseEnter={() => clearTimeout(hideTimeout)}
                  onMouseLeave={() => {
                    clearTimeout(hideTimeout);
                    hideTimeout = setTimeout(() => setAddressMenuVisible(false), 10);
                  }}
                >
                  <Menu items={addressMenuItems} />
                </div>
              ) : ''}
            </div>
          ) : (
            walletLoading ? (
              <button className="btn btn--secondary btn--disabled">
                <div className="loader__circle"></div>
                <span>Loading...</span>
              </button>
            ) : (
              <button onClick={() => dispatch(connectWallet())}>Connect Wallet</button>
            )
          )
        }
      </nav>

    </header>
  );
}