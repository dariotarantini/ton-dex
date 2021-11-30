import { useState } from 'react';

export default function useModal() {
  const [isShowing, setIsShowing] = useState(false);

  return {
    isShowing: isShowing,
    toggle: (b?: boolean) => setIsShowing(b ?? !isShowing),
  };
}