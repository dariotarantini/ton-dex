import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { requestWallet, selectWallet, selectWalletLoading } from "../../store/reducers/walletReducers";
import { selectDeadline } from "../../store/reducers/settingsReducer";

import { getPool, getPoolContract, getPriceImpact } from "../../api/pool";
import { getCoinBalance } from "../../api/wallet";
import { swap } from "../../api/swap";

import ITransaction from "../../api/types/ITransaction";
import ICoin from "../../api/types/ICoin";
import IPool from "../../api/types/IPool";

import TransactionDetails from "./TransactionDetails/TransactionDetails";
import SwapConfirmation from "../../modals/SwapConfirmation/SwapConfirmation";
import TransactionSent from "../../modals/TransactionSent/TransactionSent";
import PairInput from "../PairInput/PairInput";

import './SwapForm.css';

type props = {
  from?: ICoin
  to?: ICoin
  fromAmount: number
  toAmount: number

  setFrom: (c?: ICoin) => void
  setTo: (c?: ICoin) => void
  setFromAmount: (n: number) => void
  setToAmount: (n: number) => void
};

export default function SwapForm({
  from,
  to,
  fromAmount,
  toAmount,
  setFrom,
  setTo,
  setFromAmount,
  setToAmount
}: props) {
  const [pool, setPool] = useState<IPool>();
  const [transaction, setTransaction] = useState<ITransaction>();
  const [fromBalance, setFromBalance] = useState<number>();
  const [toBalance, setToBalance] = useState<number>();
  const [priceImpact, setPriceImpact] = useState<number>();

  const [isConfirmationVisible, setConfirmationVisible] = useState<boolean>(false);
  const [reversed, setReversed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const deadline = useAppSelector(selectDeadline);
  const wallet = useAppSelector(selectWallet);
  const walletLoading = useAppSelector(selectWalletLoading);

  const dispatch = useAppDispatch();

  const confirmTransaction = async () => {
    setLoading(true);
    setConfirmationVisible(true);
  }

  useEffect(() => {
    (async () => {
      if (pool) {
        setPriceImpact(await getPriceImpact(pool, fromAmount));
      } else {
        setPriceImpact(undefined);
      }
    })();
  }, [pool, fromAmount]);

  useEffect(() => {
    (async () => {
      try {
        if (from && to) {
          const contract = await getPoolContract(from.contract, to.contract);
          setPool(await getPool(contract));
        }
      } catch (e) {
        setPool(undefined);
      }
    })();
  }, [from, to]);

  useEffect(() => {
    (async () => {
      try {
        if (from) {
          setFromBalance(await getCoinBalance(from));
        } else {
          setFromBalance(undefined)
        }
      } catch (e) {
        setFromBalance(undefined);
      }

      try {
        if (to) {
          setToBalance(await getCoinBalance(to));
        } else {
          setToBalance(undefined)
        }
      } catch (e) {
        setToBalance(undefined);
      }
    })();
  }, [wallet, from, to]);

  return (
    <div className={
      'card border_separator' +
      (loading ? ' swap_form--loading' : '')
    }>

      <PairInput
        rate={pool?.pair.rate[reversed ? 'backward' : 'forward'] ?? 0}
        reversed={reversed}
        setReversed={setReversed}

        from={from}
        fromAmount={fromAmount}
        fromBalance={fromBalance}
        setFrom={setFrom}
        setFromAmount={setFromAmount}

        to={to}
        toAmount={toAmount}
        toBalance={toBalance}
        setTo={setTo}
        setToAmount={setToAmount} 
      />

      {
        pool
          ? (
            <TransactionDetails
              pool={pool}
              reversed={reversed}
              priceImpact={priceImpact}
              amount={fromAmount}
            />
          ) : ''
      }

      {transaction ? (
        <TransactionSent
          rate={pool?.pair.rate[reversed ? 'backward' : 'forward'] ?? 0}
          transaction={transaction}
          isShowing={typeof transaction !== 'undefined'}
          toggle={() => setTransaction(undefined)}
        />
      ) : ''}

      {pool ? (
        <SwapConfirmation
          reversed={reversed}
          isShowing={isConfirmationVisible}
          toggle={(b?: boolean) => setConfirmationVisible(b ?? !isConfirmationVisible)}
          details={{
            pool: pool,
            deadline: deadline,
            impact: priceImpact ?? 0,
            amounts: {
              from: fromAmount,
              to: toAmount
            }
          }}
          onDecline={() => setLoading(false)}
          onConfirm={async () => {
            if (!pool) return;
  
            try {
              const tx = await swap({
                pair: pool.pair,
                amount: fromAmount
              });
              setTransaction(tx);
              setFromAmount(0);
              setToAmount(0);
            } catch (e) {
              // TODO: show error modal
              console.error(e);
            } finally {
              setLoading(false);
              setConfirmationVisible(false);
            }
          }}
        />
      ) : ''}

      <div className={
        'action__buttons' +
        (!pool ? ' action__buttons--no-pool' : '')
      }>
        {
          loading || walletLoading
            ? (
              <button className="btn btn--secondary btn--unclickable">
                <div className="loader__circle"></div>
                <span>Loading...</span>
              </button>
            ) : (
              wallet
                ? pool
                  ? fromAmount > 0
                    ? fromAmount <= (fromBalance ?? 0) 
                      ? <button onClick={confirmTransaction}>Swap</button>
                      : <button className="btn--secondary btn--disabled">Insufficient balance</button>
                    : <button className="btn--secondary btn--disabled">Enter an amount</button>
                  : <button className="btn--secondary btn--disabled">Select pair</button>
                : (
                  <button
                    className="btn btn--secondary"
                    onClick={() => dispatch(requestWallet())}
                  >Connect Wallet</button>
                )
            )
        }
      </div>
    </div>
  );
}