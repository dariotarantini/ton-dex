import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { selectCoinlistSources, setCoinlists, setSuggestions } from './store/reducers/coinlistsReducer';
import { cleanWalletError, selectWalletError } from './store/reducers/walletReducers';
import { selectTheme, Theme } from './store/reducers/settingsReducer';
import { useAppSelector } from './store/hooks';

import { getCoinList, getSuggestions } from './api/coinlist';
import ICoinList from './api/types/ICoinList';

import Header from './components/Header/Header';
import Router from './pages/Router';

import WalletError from './modals/WalletErrorModal/WalletErrorModal';

import './App.css';

export default function App() {
  const sources = useAppSelector(selectCoinlistSources);
  const walletError = useAppSelector(selectWalletError);
  const theme = useAppSelector(selectTheme);

  const dispatch = useDispatch();

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      document.documentElement.classList[
        media.matches
          ? 'add'
          : 'remove'
      ]('dark_mode');
    }

    switch (theme) {
      case Theme.DARK:
        document.documentElement.classList.add('dark_mode');
        break;
      case Theme.LIGHT:
        document.documentElement.classList.remove('dark_mode');
        break;
      case Theme.AUTO:
      default:
        updateTheme();
        media.addEventListener('change', updateTheme);
    }

    return () => media.removeEventListener('change', updateTheme);
  }, [theme]);

  useEffect(() => {
    (async () => {
      try {
        let cl: ICoinList[] = [];
  
        for (let s of sources) {
          cl = [ ...cl, (await getCoinList(s))];
        }
  
        dispatch(setCoinlists(cl));
        dispatch(setSuggestions(await getSuggestions()));
      } catch (e) {
        console.error('Cannot fetch coinlists.')
      }
    })();
  }, [sources, dispatch]);

  return (
    <div className="App">

      <WalletError
        isShowing={typeof walletError !== 'undefined'}
        toggle={() => dispatch(cleanWalletError())}
      />

      <Header />

      <main>
        <Router />
      </main>

    </div>
  );
}