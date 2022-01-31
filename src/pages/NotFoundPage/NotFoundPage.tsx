import { useNavigate } from 'react-router-dom';
import { ReactComponent as NoPoolSVG } from '../../assets/images/noPool.svg';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="page page--error">
      <div className="page__content">
        <NoPoolSVG />
        <div className="page_error__text">
          <h2>Page not found</h2>
          <button
            className="btn--secondary"
            onClick={() => navigate(-1)}
          >Go back</button>
        </div>
      </div>
    </div>
  );
}