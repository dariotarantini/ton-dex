import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import stringifyNumber from "../../utils/stringifyNumber";
import stringifyPercentage from "../../utils/stringifyPercentage";

import { addLiquidity, createPool, getPool, getPoolContract, getPoolShare } from "../../api/pool";
import { getCoinBalance } from "../../api/wallet";
import IPool from "../../api/types/IPool";
import ITransaction from "../../api/types/ITransaction";
import TransactionSent from "../../modals/TransactionSent/TransactionSent";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { requestWallet, selectWallet, selectWalletLoading } from "../../store/reducers/walletReducers";
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

import AddLiquidityConfirmation from "../../modals/AddLiquidityConfirmation/AddLiquidityConfirmation";
import StartingPriceInput from "../../components/StartingPriceInput/StartingPriceInput";
import PairInput from "../../components/PairInput/PairInput";

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
  const walletLoading = useAppSelector(selectWalletLoading);
  const from = useAppSelector(selectFrom);
  const fromAmount = useAppSelector(selectFromAmount);
  const to = useAppSelector(selectTo);
  const toAmount = useAppSelector(selectToAmount);
  const startingPrice = useAppSelector(selectStartingPrice);

  const [pool, setPool] = useState<IPool>();
  const [transaction, setTransaction] = useState<ITransaction>();

  const [isConfirmationVisible, setConfirmationVisible] = useState<boolean>(false);
  const [reversed, setReversed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [share, setShare] = useState<Shares>();

  const [fromBalance, setFromBalance] = useState<number>();
  const [toBalance, setToBalance] = useState<number>();

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

      {transaction ? (
        <TransactionSent
          isShowing={typeof transaction !== 'undefined'}
          toggle={() => setTransaction(undefined)}
          transaction={transaction}
        />
      ) : ''}

      {from && to ? (
        <AddLiquidityConfirmation
          isShowing={isConfirmationVisible}
          toggle={(b?: boolean) => setConfirmationVisible(b ?? !isConfirmationVisible)}
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
                // TODO: show error
                console.error(e);
                setTransaction(undefined);
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
                // TODO: show error
                console.error(e);
                setTransaction(undefined);
              }
            }
            setLoading(false);
            setConfirmationVisible(false);
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
      ) : ''}

      <div className="card__title">
        <h4>Add liquidity</h4>
        <Cog onClick={() => navigate('/settings')} />
      </div>

      <div className="card border_separator">
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
        ) : ''}

        {(from && to) ? (
          pool ? (
            <div className="liquidity__info">

              <div className="liquidity_info__prop">
                <span className="title">{pool.pair.from.ticker} Price</span>
                <span>{stringifyNumber(pool.pair.rate.forward)} {pool.pair.to.ticker}</span>
              </div>

              <div className="liquidity_info__prop">
                <span className="title">{pool.pair.to.ticker} Price</span>
                <span>{stringifyNumber(pool.pair.rate.backward)} {pool.pair.from.ticker}</span>
              </div>

              <div className="liquidity_info__prop">
                <span className="title">Pool share</span>
                <span>{stringifyPercentage(fromAmount / pool.locked.from)}%</span>
              </div>

              <div className="liquidity_info__prop">
                <span className="title">Pool fee</span>
                <span>{pool.fee}%</span>
              </div>

            </div>
          ) : (
            <div className="liquidity__info">

              {startingPrice !== 0 ? (
                <div className="liquidity_info__prop">
                  <span className="title">{to.ticker} Price</span>
                  <span>{stringifyNumber(1 / startingPrice)} {from.ticker}</span>
                </div>
              ) : ''}

              <div className="liquidity_info__prop">
                <span className="title">Pool fee</span>
                <span>{fee}%</span>
              </div>

            </div>
          )
        ) : ''}

        <div
          className={
            'action__buttons' +
            ((!from || !to) ? ' action__buttons--no-pool' : '')
          }
        >
          {loading || walletLoading ? (
            <button className="btn btn--secondary btn--unclickable">
              <div className="loader__circle"></div>
              <span>Loading...</span>
            </button>
          ) : (
            wallet ? (
              (from && to) ? (
                (fromAmount > 0 && toAmount > 0) ? (
                  (
                    fromBalance && toBalance &&
                    (fromBalance >= fromAmount && toBalance >= toAmount)
                  ) ? (
                    pool ? (
                      <button
                        onClick={async () => {
                          try {
                            setLoading(true);
                            setConfirmationVisible(true);
                            setShare(await getPoolShare(pool.contract, {
                              from: fromAmount,
                              to: toAmount
                            }));
                          } catch(e) {
                            setLoading(false);
                            setConfirmationVisible(false);
                            console.error(e);
                          }
                        }}
                      >Add liquidity</button>
                    ) : (
                      startingPrice !== 0 ? (
                        <button
                          onClick={() => {
                            setLoading(true);
                            setConfirmationVisible(true);
                          }}
                        >Create pool</button>
                      ) : (
                        <button
                          className="btn--secondary btn--disabled"
                        >Enter starting price</button>
                      )
                    )
                  ) : (
                    <button
                      className="btn--secondary btn--disabled"
                    >Insufficient balance</button>
                  )
                ) : (
                  <button
                    className="btn--secondary btn--disabled"
                  >Enter an amount</button>
                )
              ) : (
                <button
                  className="btn--secondary btn--disabled"
                >Select pair</button>
              )
            ) : (
              <button
                className="btn btn--secondary"
                onClick={() => dispatch(requestWallet())}
              >Connect Wallet</button>
            )
          )}
        </div>

      </div>

    </div>
  );
}