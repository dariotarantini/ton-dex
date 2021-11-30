import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

import './Modal.css';

type props = {
  children: ReactNode,
  isShowing: boolean,
  toggle: (b?: boolean) => void,
};

export default function Modal({ children, isShowing, toggle }: props) {
  const keyHandler = (
    (e: KeyboardEvent) => {
      e.stopImmediatePropagation();
      if (e.key === 'Escape') toggle(false);
    }
  ) as EventListenerOrEventListenerObject;

  useEffect(() => {
    window.addEventListener('keyup', keyHandler);
    return () => window.removeEventListener('keyup', keyHandler);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isShowing) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => document.body.classList.remove('no-scroll');
  }, [isShowing]);

  return isShowing ? createPortal(
    <div
      className="modal__wrapper"
      onClick={e => toggle()}
    >
      <div
        className="modal"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  , document.body) : null;
}