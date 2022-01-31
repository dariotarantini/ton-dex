import type IPosition from "../../../api/types/IPosition";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import useLoading from '../../../hooks/useLoading';
import { getLiquidityPositions } from "../../../api/pool";

import { useAppSelector } from "../../../store/hooks";
import { selectWallet } from "../../../store/reducers/walletReducers";

import PositionCard from "../../../components/PositionCard/PositionCard";

import { ReactComponent as NoPoolsSVG } from '../../../assets/images/noPools.svg';

import './YourPools.css';

export default function YourPools() {
  const {preloading, loading, setLoading} = useLoading();

  const wallet = useAppSelector(selectWallet);

  const [positions, setPositions] = useState<IPosition[]>();

  useEffect(() => {
    if (!wallet) {
      setPositions(undefined);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setPositions(await getLiquidityPositions());
      } catch (e) {
        setPositions(undefined);
      } finally {
        setLoading(false);
      }
    })();

    // eslint-disable-next-line
  }, [wallet]);

  const renderPositions = () => positions?.map((p, i) => <PositionCard position={p} key={i} />);

  if (preloading && loading) return null;

  if (loading) {
    return (
      <div className="pools pools--loading your_pools">
        <div className="loader__wrapper">
          <div className="loader__circle loader__circle--big"></div>
        </div>
      </div>
    );
  }

  if (!positions || !positions.length) {
    return (
      <div className="page__content page__content--empty">
        <NoPoolsSVG />
        <div className="page_content__text">
          <p>
            You don't have any positions yet.&nbsp;
            <Link to="/pool/all" replace={true}>explore pools</Link>
            or
            <Link
              to="/add"
              onClick={() => {
              }}
            >create new</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page__content">
      <h2>Your pools</h2>
      <div className="your_pools">
        <div className="no_flex your_pools__positions">
          {renderPositions()}
        </div>
      </div>
    </div>
  );
}