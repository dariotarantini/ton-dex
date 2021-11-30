import Header from './components/Header/Header';
import Router from './pages/Router';

import './App.css';
import { useEffect } from 'react';
import { selectCoinlistSources, setCoinlists, setSuggestions } from './store/reducers/coinlistsReducer';
import { useAppSelector } from './store/hooks';
import ICoinList from './api/types/ICoinList';
import { getCoinList, getSuggestions } from './api/coin';
import { useDispatch } from 'react-redux';

export default function App() {
  const sources = useAppSelector(selectCoinlistSources);

  const dispatch = useDispatch();

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
    // eslint-disable-next-line
  }, [sources]);

  return (
    <div className="App">

      <Header />

      <main>
        <Router />
      </main>

    </div>
  );
}