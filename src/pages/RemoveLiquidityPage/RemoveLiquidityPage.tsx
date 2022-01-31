import type IPool from "../../api/types/IPool";
import type IPosition from "../../api/types/IPosition";
import type ITransaction from "../../api/types/ITransaction";

import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { setFrom, setFromAmount, setTo, setToAmount } from "../../store/reducers/addLiquidityReducer";
import { connectWallet, selectWallet } from "../../store/reducers/walletReducers";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

import useModal from "../../hooks/useModal";
import useLoading from '../../hooks/useLoading';
import { getLiquidityPositions, getPool, removeLiquidity } from "../../api/pool";
import stringifyNumber from "../../utils/stringifyNumber";

import CoinIcon from "../../components/CoinIcon/Coinlcon";
import RangeSelector from "../../components/RangeSelector/RangeSelector";
import SendButton from "../../components/SendButton/SendButton";

import TransactionSent from "../../modals/TransactionSent/TransactionSent";
import TransactionError from "../../modals/TransactionError/TransactionError";
import RemoveLiquidityConfirmation from "../../modals/RemoveLiquidityConfirmation/RemoveLiquidityConfirmation";

import { ReactComponent as CogSVG } from '../../assets/icons/cog.svg';
import { ReactComponent as NoWalletSVG } from '../../assets/images/noWallet.svg';
import { ReactComponent as NoContractSVG } from '../../assets/images/noContract.svg';
import { ReactComponent as NoPoolSVG } from '../../assets/images/noPool.svg';
import { ReactComponent as NotFoundSVG } from '../../assets/images/notFound.svg';
import { ReactComponent as NoLiquiditySVG } from '../../assets/images/noLiquidity.svg';

import './RemoveLiquidityPage.css';

enum Error {
  NO_CONTRACT,
  NO_POOL,
  NO_POSITION,
  UNKNOWN
}

export default function RemoveLiquidityPage() {
  const {preloading, loading, setLoading} = useLoading();
  const [error, setError] = useState<Error>();

  const navigate = useNavigate();
  const { contract } = useParams();

  const dispatch = useAppDispatch();
  const wallet = useAppSelector(selectWallet);

  const [pool, setPool] = useState<IPool>();
  const [position, setPosition] = useState<IPosition>();
  const [percentage, setPercentage] = useState(0);
  const [firstTokenAmount, setFirstTokenAmount] = useState(0);
  const [secondTokenAmount, setSecondTokenAmount] = useState(0);
  const [selectedTokens, setSelectedTokens] = useState(0);
  const [transaction, setTransaction] = useState<ITransaction>();

  const { isShowing: isConfirmationVisible, toggle: toggleConfirmation } = useModal();
  const { isShowing: isTransactionFailed, toggle: toggleTransactionFailed } = useModal();

  const [confirmationLoading, setConfirmationLoading] = useState(false);

  const getPosition = useCallback((positions?: IPosition[]) => {
    if (!positions) return undefined;

    for (let p of positions) {
      if (p.contract === contract) return p;
    }

    return undefined;
  }, [contract]);

  useEffect(() => {
    setFirstTokenAmount(
      Math.floor(percentage / 100 * (position?.amount.from ?? 0)) / (10 ** (position?.pair.from.decimals ?? 1))
    );
  }, [percentage, position]);

  useEffect(() => {
    setSecondTokenAmount(
      Math.floor(percentage / 100 * (position?.amount.to ?? 0)) / (10 ** (position?.pair.to.decimals ?? 1))
    );
  }, [percentage, position]);

  useEffect(() => {
    if (!contract) {
      setError(Error.NO_CONTRACT);
      setLoading(false);
      return;
    }

    if (!wallet) {
      setLoading(false);
      return;
    }

    setLoading(true);

    (async () => {
      const pool = await getPool(contract)
        .catch(() => setError(Error.NO_POOL));
      
      if (pool) {
        setPool(pool);

        const positions = await getLiquidityPositions()
          .catch(() => setError(Error.UNKNOWN));
        
        const position = getPosition(positions ?? undefined);

        if (!position) {
          setError(Error.NO_POSITION);
        } else {
          setPosition(position);
        }
      }

      setLoading(false);
    })();
    // eslint-disable-next-line
  }, [contract, wallet, navigate]);

  useEffect(() => {
    if (!position) return;
    setSelectedTokens(Math.floor(percentage / 100 * position.tokens));
  }, [percentage, position]);

  if (preloading && loading) return null;

  if (loading) {
    return (
      <div className="page page--centered">
        <div className="loader__circle loader__circle--big"></div>
      </div>
    );
  }

  if (error === Error.NO_CONTRACT) {
    return (
      <div className="page page--error">
        <div className="page__content">
          <NoContractSVG />
          <div className="page_error__text">
            <p>No contract specified</p>
            <button
              className="btn--secondary"
              onClick={() => navigate(-1)}
            >Go back</button>
          </div>
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="page page--error">
        <div className="page__content">
          <NoWalletSVG />
          <div className="page_error__text">
            <p>Connect your wallet to access this page</p>
            <button
              className="btn--secondary"
              onClick={() => {
                setLoading(true);
                dispatch(connectWallet());
              }}
            >Connect wallet</button>
          </div>
        </div>
      </div>
    );
  }

  if (typeof error !== 'undefined') {
    let content: JSX.Element;

    switch (error) {
      case Error.NO_POOL:
        content = (
          <div className="page__content">
            <NoPoolSVG />
            <div className="page_error__text">
              <h2>Pool not found</h2>
              <button
                className="btn--secondary"
                onClick={() => navigate(-1)}
              >Go back</button>
            </div>
          </div>
        );
        break;
      case Error.NO_POSITION:
        content = (
          <div className="page__content">
            <NoLiquiditySVG />
            <div className="page_error__text">
              <h2>No liquidity</h2>
              <p>You haven't provided liquidity to this pool.</p>
              <button
                className="btn--secondary"
                onClick={() => {
                  dispatch(setFrom(pool?.pair.from));
                  dispatch(setTo(pool?.pair.to));
                  dispatch(setFromAmount(0));
                  dispatch(setToAmount(0));
                  navigate('/add');
                }}
              >Add liquidity</button>
            </div>
          </div>
        );
        break;
      case Error.UNKNOWN:
      default:
        content = (
          <div className="page__content">
            <div className="page_error__text">
            </div>
            <div className="page_error__text">
              <NotFoundSVG />
              <div className="page_error__text">
                <h2>There's an error</h2>
                <p>We're solving it right now, so try again later.</p>
              </div>
            </div>
          </div>
        );
    }

    return (
      <div className="page page--error">
        {content}
      </div>
    );
  }

  return (
    <>
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

      {position ? (
        <RemoveLiquidityConfirmation
          isShowing={isConfirmationVisible}
          toggle={toggleConfirmation}
          position={position}
          tokens={selectedTokens}
          fromAmount={firstTokenAmount}
          toAmount={secondTokenAmount}

          onDecline={() => setConfirmationLoading(false)}
          onConfirm={async () => {
            if (!position) return;

            try {
              const tx = await removeLiquidity(position, selectedTokens);
              setTransaction(tx);

              const positions = await getLiquidityPositions()
                .catch(() => setError(Error.UNKNOWN));

              const newPosition = getPosition(positions ?? undefined);

              setPercentage(0);

              if (!position) {
                navigate('/pool');
              } else {
                setPosition(newPosition);
              }
            } catch (e) {
              console.error(e);
              setTransaction(undefined);
              toggleTransactionFailed(true);
            } finally {
              setConfirmationLoading(false);
              toggleConfirmation(false);
            }
          }}
        />
      ) : null}

      <div className="page page--centered">

        <div className="card__title">
          <h4>Remove liquidity</h4>
          <CogSVG onClick={() => navigate('/settings')} />
        </div>

        <div className="card">

          <div className="card__content border_separator">

            <div
              className="remove_liquidity__pool border_separator"
              onClick={() => navigate('/pool/your')}
            >
              <div className="remove_liquidity_pool__icons">
                <CoinIcon coin={position?.pair.from} />
                <CoinIcon coin={position?.pair.to} />
              </div>
              <span>{position?.pair.from.ticker} ~ {position?.pair.to.ticker}</span>
            </div>

            <div className="remove_liquidity__info">
              <h1>{percentage}%</h1>
              <span>{stringifyNumber(selectedTokens / (10 ** (position?.decimals ?? 1)))} tokens</span>
            </div>

            <RangeSelector
              value={percentage}
              setValue={setPercentage}
            />

          </div>

          <div className="card__info">

            <div className="card_info__prop">
              <span className="card_info__title">{position?.pair.from.ticker}</span>
              <span>{stringifyNumber(firstTokenAmount)} {position?.pair.from.ticker}</span>
            </div>

            <div className="card_info__prop">
              <span className="card_info__title">{position?.pair.to.ticker}</span>
              <span>{stringifyNumber(secondTokenAmount)} {position?.pair.to.ticker}</span>
            </div>

          </div>

          <div className="card__action_buttons">
            <SendButton
              loading={confirmationLoading}
              isAmountValid={percentage > 0}
              actionText="Remove liquidity"
              action={async () => {
                setConfirmationLoading(true);
                toggleConfirmation();
              }}
            />
          </div>

        </div>

      </div>
    </>
  );
}