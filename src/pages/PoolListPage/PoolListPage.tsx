import { useCallback, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import { setFrom, setFromAmount, setStartingPrice, setTo, setToAmount } from "../../store/reducers/addLiquidityReducer";
import { selectWallet } from "../../store/reducers/walletReducers";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

import Selector from "../../components/Selector/Selector";

import './PoolListPage.css';

export default function PoolListPage() {
  const wallet = useAppSelector(selectWallet);

  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const getTab = useCallback((path?: string) => {
    switch (path ?? location.pathname) {
      case '/pool/your':
        return 0;
      case '/pool/all':
        return 1;
      default:
        return (
          typeof wallet === 'undefined'
            ? 1
            : 0
        );
    }
  }, [location.pathname, wallet]);

  const [tab, setTab] = useState(getTab());

  useEffect(() => {
    if (location.pathname !== '/pool') return;

    const path = (
      wallet
        ? '/pool/your'
        : '/pool/all'
    );

    navigate(path, { replace: true });
    setTab(getTab(path));

    // eslint-disable-next-line
  }, [location.pathname, getTab]);

  useEffect(() => { setTab(getTab()); }, [location.pathname, getTab]);

  return (
    <div className="page page--pools">

      <div className="pools__tabs">
        <Selector
          options={[
            <Link to="/pool/your" replace={true}>Your pools</Link>,
            <Link to="/pool/all" replace={true}>All pools</Link>,
            <Link
              to="/add"
              onClick={() => {
                dispatch(setFrom(undefined));
                dispatch(setTo(undefined));
                dispatch(setFromAmount(0));
                dispatch(setToAmount(0));
                dispatch(setStartingPrice(0));
              }}
            >Create</Link>
          ]}
          selected={tab}
          updater={setTab}
        />
      </div>

      <Outlet />

    </div>
  )
}