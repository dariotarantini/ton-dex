import { useCallback, useEffect, useRef, useState } from "react";

export default function useMobile() {
  const checkMobile = useCallback(() => window.innerWidth <= 700, []);
  const checkMobileRef = useRef(checkMobile);

  const [isMobile, setIsMobile] = useState(checkMobile());

  useEffect(() => {
    const resize = () => setIsMobile(checkMobileRef.current());
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return isMobile;
}