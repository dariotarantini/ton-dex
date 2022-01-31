import type IPool from "../../api/types/IPool";
import type ITransaction from "../../api/types/ITransaction";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import useModal from "../../hooks/useModal";
import stringifyNumber from "../../utils/stringifyNumber";
import stringifyPercentage from "../../utils/stringifyPercentage";

import { addLiquidity, createPool, getPool, getPoolContract, getPoolShare } from "../../api/pool";
import { getCoinBalance } from "../../api/wallet";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectWallet } from "../../store/reducers/walletReducers";
import {
  selectFrom,
  selectFromAmount,
  selectStartingPrice,
  selectTo,
  selectToAmount,
  setFrom,
  setFromAmount,
  setStartingPrice,
  setTo,
  setToAmount
} from "../../store/reducers/addLiquidityReducer";

import TransactionSent from "../../modals/TransactionSent/TransactionSent";
import TransactionError from "../../modals/TransactionError/TransactionError";
import AddLiquidityConfirmation from "../../modals/AddLiquidityConfirmation/AddLiquidityConfirmation";

import StartingPriceInput from "../../components/StartingPriceInput/StartingPriceInput";
import PairInput from "../../components/PairInput/PairInput";
import SendButton from "../../components/SendButton/SendButton";

import { ReactComponent as Cog } from '../../assets/icons/cog.svg';

import './AddLiquidityPage.css';

interface Shares {
  amount: number,
  percentage: number
}

const fee = 0.25;

export default function AddLiquidityPage() {
  const { fromContract, toContract } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const wallet = useAppSelector(selectWallet);
  const from = useAppSelector(selectFrom);
  const fromAmount = useAppSelector(selectFromAmount);
  const to = useAppSelector(selectTo);
  const toAmount = useAppSelector(selectToAmount);
  const startingPrice = useAppSelector(selectStartingPrice);

  const [pool, setPool] = useState<IPool>();
  const [transaction, setTransaction] = useState<ITransaction>();

  const [reversed, setReversed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [share, setShare] = useState<Shares>();
  
  const [fromBalance, setFromBalance] = useState<number>();
  const [toBalance, setToBalance] = useState<number>();

  const { isShowing: isConfirmationVisible, toggle: toggleConfirmation } = useModal();
  const { isShowing: isTransactionFailed, toggle: toggleTransactionFailed } = useModal();

  useEffect(() => {
    let path = '/add/';
    path += from ? from.contract : '';
    path += to ? `/${to.contract}` : '';
    navigate(path, { replace: true });
  }, [from, to, navigate]);

  useEffect(() => {
    setShare(undefined);
    (async () => {
      try {
        const contract = await getPoolContract(fromContract, toContract);
        const pool = await getPool(contract);
        if (pool) setPool(pool);
      } catch(e) {
        setPool(undefined);
      }
    })();
  }, [fromContract, toContract]);

  useEffect(() => {
    (async () => {
      try {
        if (wallet && from) setFromBalance(await getCoinBalance(from));
      } catch (e) {
        console.error(e);
      }
    })();
  }, [wallet, from]);

  useEffect(() => {
    (async () => {
      try {
        if (wallet && to) setToBalance(await getCoinBalance(to));
      } catch (e) {
        console.error(e);
      }
    })();
  }, [wallet, to]);

  return (
    <div className="page page--centered">
      <TransactionError
        isShowing={isTransactionFailed}
        toggle={toggleTransactionFailed}
      />

      {transaction ? (
        <TransactionSent
          isShowing={typeof transaction !== 'undefined'}
          toggle={() => setTransaction(undefined)}
          transaction={transaction}
        />
      ) : null}

      {from && to ? (
        <AddLiquidityConfirmation
          isShowing={isConfirmationVisible}
          toggle={toggleConfirmation}
          onDecline={() => setLoading(false)}
          onConfirm={async () => {
            if (!from && !to) return;

            if (pool) {
              try {
                const tx = await addLiquidity(pool.contract, { from: fromAmount, to: toAmount })
                setTransaction(tx);
                setFromAmount(0);
                setToAmount(0);
              } catch(e) {
                console.error(e);
                setTransaction(undefined);
                toggleTransactionFailed(true);
              }
            } else {
              try {
                const tx = await createPool({
                  from: from,
                  to: to,
                  rate: {
                    forward: startingPrice,
                    backward: 1 / startingPrice
                  }
                }, {
                  from: fromAmount,
                  to: toAmount
                });
                setTransaction(tx);
              } catch(e) {
                console.error(e);
                setTransaction(undefined);
                toggleTransactionFailed(true);
              }
            }
            setLoading(false);
            toggleConfirmation(false);
            setFromAmount(0);
            setToAmount(0);
            setStartingPrice(0);
          }}
          share={share}
          pair={{
            from: pool ? pool.pair.from : from,
            to: pool ? pool.pair.to : to,
            rate: pool?.pair.rate ?? {
              forward: startingPrice,
              backward: 1 / startingPrice
            }
          }}
          amounts={{
            from: fromAmount,
            to: toAmount
          }}
        />
      ) : null}

      <div className="card__title">
        <h4>Add liquidity</h4>
        <Cog onClick={() => navigate('/settings')} />
      </div>

      <div
        className={
          'card border_separator' +
          (typeof from === 'undefined' || typeof to === 'undefined' ? ' card--no-gap' : '')
        }
      >
        <PairInput
          rate={
            pool
              ? pool.pair.rate[reversed ? 'backward' : 'forward'] ?? 0
              : reversed ? 1 / startingPrice : startingPrice
          }
          reversed={reversed}
          setReversed={setReversed}

          from={from}
          fromAmount={fromAmount}
          fromBalance={fromBalance}
          setFrom={c => dispatch(setFrom(c))}
          setFromAmount={n => dispatch(setFromAmount(n))}

          to={to}
          toAmount={toAmount}
          toBalance={toBalance}
          setTo={c => dispatch(setTo(c))}
          setToAmount={n => dispatch(setToAmount(n))}
        />

        {!pool && (from && to) ? (
          <div className="liquidity__price">
            <p>This pool must be initialized before you can add liquidity. To initialize, select a starting price for the pool.</p>
            <StartingPriceInput
              from={from}
              to={to}
              price={startingPrice}
              setPrice={n => dispatch(setStartingPrice(n))}
            />
          </div>
        ) : null}

        {(from && to) ? (
          pool ? (
            <div className="card__info">

              <div className="card_info__prop">
                <span className="card_info__title">{pool.pair.from.ticker} Price</span>
                <span>{stringifyNumber(pool.pair.rate.forward)} {pool.pair.to.ticker}</span>
              </div>

              <div className="card_info__prop">
                <span className="card_info__title">{pool.pair.to.ticker} Price</span>
                <span>{stringifyNumber(pool.pair.rate.backward)} {pool.pair.from.ticker}</span>
              </div>

              <div className="card_info__prop">
                <span className="card_info__title">Pool share</span>
                <span>{stringifyPercentage(fromAmount / pool.locked.from)}%</span>
              </div>

              <div className="card_info__prop">
                <span className="card_info__title">Pool fee</span>
                <span>{pool.fee}%</span>
              </div>

            </div>
          ) : (
            <div className="card__info">

              {startingPrice !== 0 ? (
                <div className="card_info__prop">
                  <span className="card_info__title">{to.ticker} Price</span>
                  <span>{stringifyNumber(1 / startingPrice)} {from.ticker}</span>
                </div>
              ) : null}

              <div className="card_info__prop">
                <span className="card_info__title">Pool fee</span>
                <span>{fee}%</span>
              </div>

            </div>
          )
        ) : null}

        <div
          className={
            'card__action_buttons' +
            ((!from || !to) ? ' card__action_buttons--no-pool' : '')
          }
        >
          <SendButton
            actionText={pool ? 'Add liquidity' : 'Create pool'}
            action={async () => {
              setLoading(true);
              toggleConfirmation(true);

              if (pool) {
                try {
                  setShare(await getPoolShare(pool.contract, {
                    from: fromAmount,
                    to: toAmount
                  }));
                } catch(e) {
                  setLoading(false);
                  toggleConfirmation(false);
                  console.error(e);
                }
              }
            }}

            loading={loading}
            isPoolSelected={typeof from !== 'undefined' && typeof to !== 'undefined'}
            isAmountValid={fromAmount > 0 && toAmount > 0}
            isBalanceValid={(
              typeof fromBalance !== 'undefined' &&
              typeof toBalance !== 'undefined' &&
              (fromBalance >= fromAmount && toBalance >= toAmount)
            )}

            isStartingPriceValid={pool ? true : startingPrice !== 0}
          />
        </div>

      </div>
    </div>
  );
}