import type ITransaction from "../../api/types/ITransaction";
import type ICoin from "../../api/types/ICoin";
import type IPool from "../../api/types/IPool";

import { useEffect, useState } from "react";

import { useAppSelector } from "../../store/hooks";
import { selectWallet } from "../../store/reducers/walletReducers";
import { selectDeadline } from "../../store/reducers/settingsReducer";

import useModal from "../../hooks/useModal";
import { getPool, getPoolContract, getPriceImpact } from "../../api/pool";
import { getCoinBalance } from "../../api/wallet";
import { swap } from "../../api/swap";

import SwapConfirmation from "../../modals/SwapConfirmation/SwapConfirmation";
import TransactionSent from "../../modals/TransactionSent/TransactionSent";
import TransactionError from "../../modals/TransactionError/TransactionError";

import TransactionDetails from "./TransactionDetails/TransactionDetails";
import PairInput from "../PairInput/PairInput";
import SendButton from "../SendButton/SendButton";

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

  const { isShowing: isTransactionFailed, toggle: toggleTransactionFailed } = useModal();

  const deadline = useAppSelector(selectDeadline);
  const wallet = useAppSelector(selectWallet);

  const confirmTransaction = async () => {
    setLoading(true);
    setConfirmationVisible(true);
  }

  useEffect(() => {
    setReversed(pool?.pair.from.contract !== from?.contract);
  }, [pool, from]);

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
    <>
      <TransactionError
        isShowing={isTransactionFailed}
        toggle={toggleTransactionFailed}
      />

      {transaction ? (
        <TransactionSent
          rate={pool?.pair.rate[reversed ? 'backward' : 'forward'] ?? 0}
          transaction={transaction}
          isShowing={typeof transaction !== 'undefined'}
          toggle={() => setTransaction(undefined)}
        />
      ) : null}

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
              console.error(e);
              toggleTransactionFailed(true);
              setTransaction(undefined);
            } finally {
              setLoading(false);
              setConfirmationVisible(false);
            }
          }}
        />
      ) : null}

      <div className={
        'card border_separator' +
        (!pool ? ' card--no-gap' : '') +
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

        {pool ? (
          <TransactionDetails
            pool={pool}
            reversed={reversed}
            priceImpact={priceImpact}
            amount={fromAmount}
          />
        ) : null}

        <div className={
          'card__action_buttons' +
          (!pool ? ' card__action_buttons--no-pool' : '')
        }>
          <SendButton
            action={confirmTransaction}
            actionText="Swap"
            loading={loading}
            isPoolSelected={typeof from !== 'undefined' && typeof to !== 'undefined'}
            isPoolValid={!!pool}
            isAmountValid={fromAmount > 0}
            isBalanceValid={fromAmount <= (fromBalance ?? 0)}
          />
        </div>
      </div>
    </>
  );
}