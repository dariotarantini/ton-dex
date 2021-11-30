import { ReactNode } from 'react';

import './Scrollable.css';

type props = {
  children?: ReactNode
}

export default function Scrollable({ children }: props) {
  return (
    <div className="scrollable__wrapper">
      <div className="scrollable">
        {children}
      </div>
    </div>
  );
}