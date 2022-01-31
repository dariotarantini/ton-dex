import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectSlippage,
  selectDeadline,
  setSlippage,
  setDeadline,
  selectTheme,
  Theme,
  setTheme
} from '../../store/reducers/settingsReducer';

import Selector from '../../components/Selector/Selector';

import { ReactComponent as ArrowFull } from '../../assets/icons/arrow_full.svg';

import './SettingsPage.css';

const getSelectorId = (slippage: number) => {
  switch (slippage) {
    case 0.1:
      return 0;
    case 0.5:
      return 1;
    case 1:
      return 2;
    default:
      return 3;
  }
}

const getThemeIndex = (theme: Theme) => {
  switch (theme) {
    case Theme.LIGHT:
      return 0;
    case Theme.DARK:
      return 1;
    case Theme.AUTO:
    default:
      return 2;
  }
}

export default function SettingsPage() {
  const slippage = useAppSelector(selectSlippage);
  const deadline = useAppSelector(selectDeadline);
  const theme = useAppSelector(selectTheme);

  const [selectedSlippage, setSelectedSlippage] = useState<number>(getSelectorId(slippage));

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const keyHandler = (
    (e: KeyboardEvent) => {
      e.stopImmediatePropagation();
      if (e.key === 'Escape') navigate(-1);
    }
  ) as EventListenerOrEventListenerObject;

  useEffect(() => {
    let slippage;
    switch(selectedSlippage) {
      case 0:
        slippage = .1;
        break;
      case 1:
        slippage = .5;
        break;
      case 2:
        slippage = 1;
        break;
    }
    if (slippage) dispatch(setSlippage(slippage));
  }, [selectedSlippage, dispatch]);

  useEffect(() => {
    window.addEventListener('keyup', keyHandler);
    return () => window.removeEventListener('keyup', keyHandler);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="page page--centered">

      <div className="card__title card__title--settings">
        <ArrowFull onClick={() => navigate(-1)} />
        <h4>Transaction settings</h4>
      </div>

      <div className="card border_separator">
        <div className="settings__options">

          <div className="settings__option settings__option--max">
            <h5>Slippage tolerance</h5>

            <div className="settings_option__props">
              <Selector
                selected={selectedSlippage}
                updater={setSelectedSlippage}
                options={[
                  '0.1',
                  '0.5',
                  '1',
                  (
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={slippage}
                      onChange={e => dispatch(setSlippage(parseFloat(e.target.value)))}
                    />
                  )
                ]}
              />
              <span>%</span>
            </div>
          </div>

          <div className="settings__option">
            <h5>Deadline</h5>
            <div className="settings_option__props">
              <input
                type="number"
                min="0"
                value={deadline}
                onChange={e => dispatch(setDeadline(parseFloat(e.target.value)))}
              />
              <span>minute{deadline % 10 !== 1 ? 's' : ' '}</span>
            </div>
          </div>

          <div className="settings__option">
            <h5>Theme</h5>
            <div className="settings_option__props">
              <Selector
                options={['Light', 'Dark', 'Auto']}
                selected={getThemeIndex(theme)}
                updater={(i: number) => {
                  switch (i) {
                    case 0:
                      dispatch(setTheme(Theme.LIGHT));
                      break;
                    case 1:
                      dispatch(setTheme(Theme.DARK));
                      break;
                    case 2:
                    default:
                      dispatch(setTheme(Theme.AUTO));
                  }
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}