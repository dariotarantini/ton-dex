import { useParams, useNavigate } from "react-router-dom";

import { ReactComponent as Cog } from '../../assets/icons/cog.svg';

import './RemoveLiquidityPage.css';

export default function RemoveLiquidityPage() {
  const navigate = useNavigate();
  const { contract } = useParams();

  // const [pool, setPool] = useState<IPool>();

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const pool = await getPool(contract ?? '');
  //       setPool(pool);
  //     } catch (e) {
  //       navigate('/pool', { replace: true });
  //     }
  //   })();
  // }, [contract, navigate]);

  return (
    <div className="page page--centered">

      <div className="card__title">
        <h4>Remove liquidity</h4>
        <Cog onClick={() => navigate('/settings')} />
      </div>

      <div className="card">
        {contract}
      </div>

    </div>
  );
}