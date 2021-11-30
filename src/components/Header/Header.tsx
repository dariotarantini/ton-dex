import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { requestWallet, disconnectWallet, selectWallet, selectWalletLoading } from "../../store/reducers/walletReducers";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

import { ReactComponent as Logo } from "../../assets/icons/logo.svg";

import Menu from "../Menu/Menu";

import './Header.css';

const trim = (address: string) => `${address.slice(0, 6)}...${address.slice(-5)}`;

export default function Header() {
  const location = useLocation();
  const navifate = useNavigate();

  const dispatch = useAppDispatch();

  const wallet = useAppSelector(selectWallet);
  const walletLoading = useAppSelector(selectWalletLoading);

  const [isAddressMenuVisible, setAddressMenuVisible] = useState<boolean>(false);

  let hideTimeout: NodeJS.Timeout;

  const addressMenuItems = [
    {
      title: 'Transactions',
      action: () => {
        navifate('/transactions');
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
        <Logo />
        <span>TON DEX</span>
      </Link>

      <div className="header__nav">
        {
          (
            location.pathname === '/'
            || location.pathname === '/settings'
          ) ? (
              <Link to="/pool">
                <button className="btn--trinary">Pool</button>
              </Link>
            ) : (
              <Link to="/">
                <button className="btn--trinary">Swap</button>
              </Link>
            )
        }
        {
          wallet ? (
            <div className="address_menu">
              <button
                className="btn btn--secondary btn--unclickable"
                onMouseEnter={() => {
                  clearTimeout(hideTimeout);
                  setAddressMenuVisible(true);
                }}
                onMouseLeave={() => hideTimeout = setTimeout(() => setAddressMenuVisible(false), 10)}
              >{trim(wallet.address ?? '')}</button>
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
              <button onClick={() => dispatch(requestWallet())}>Connect Wallet</button>
            )
          )
        }
      </div>

    </header>
  );
}