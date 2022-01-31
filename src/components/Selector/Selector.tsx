import { useCallback, useEffect, useRef, useState } from "react";

import './Selector.css';

type props = {
  options: Array<string | JSX.Element>
  selected: number
  updater: (n: number) => void
}

export default function Selector({
  options,
  selected,
  updater
}: props) {
  const [animating, setAnimating] = useState(false);

  const [selectedWidth, setSelectedWidth] = useState(0);
  const [selectedLeft, setSelectedLeft] = useState(0);
  const [rootWidth, setRootWidth] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLDivElement>(null);

  const select = useCallback((i: number) => {
    if (!rootRef.current) return;

    const selectedEl = rootRef.current.querySelectorAll('.selector__option')[i];

    if (!selectedEl) {
      setSelectedWidth(0);
      setSelectedLeft(0);
      return;
    }

    const selectedDimensions = selectedEl.getBoundingClientRect();
    const rootDimensions = rootRef.current.getBoundingClientRect();

    setSelectedWidth(selectedDimensions.width);
    setSelectedLeft(selectedDimensions.left - rootDimensions.left);

    if (selected !== i) updater(i);
  }, [selected, updater]);

  useEffect(() => { select(selected); }, [selected, select]);

  useEffect(() => {
    select(selected);
    setTimeout(() => setAnimating(true));
    return () => setAnimating(false);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!rootRef.current) return;

    const observer = new ResizeObserver(e => e.forEach(() => {
      const el = e[0];
      const d = el.target.getBoundingClientRect();
      setRootWidth(d.width);
    }));

    observer.observe(rootRef.current);

    return () => observer.disconnect();
  }, [rootRef]);

  useEffect(() => { select(selected); }, [select, selected, rootWidth]);

  const renderOptions = () => options.map((o, i) => (
    <div
      key={i}
      className={
        'selector__option' +
        (typeof o !== 'string' ? ' selector__option--element' : '') +
        (i === selected ? ' selector__option--selected' : '')
      }
      onClick={() => select(i)}
    >{o}</div>
  ));

  return (
    <div
      ref={rootRef}
      className={
        "selector" +
        (animating ? ' selector--animating' : '')
      }
    >
      <div className="selector__options">{renderOptions()}</div>
      <div
        ref={selectedRef}
        className="selector__selected"
        style={{
          width: selectedWidth,
          left: selectedLeft,
        }}
      ></div>
    </div>
  );
}