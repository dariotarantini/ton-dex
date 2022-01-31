import { useCallback, useEffect, useState } from "react";

export default function useMobile(defaultValue?: boolean) {
  const [loading, _setLoading] = useState(defaultValue ?? true);
  const [preloading, setPreloading] = useState(defaultValue ?? true);

  useEffect(() => { setTimeout(() => setPreloading(false), 250)}, [preloading]);

  const setLoading = useCallback((b: boolean) => {
    setPreloading(b);
    _setLoading(b);
  }, []);

  return {
    preloading,
    loading,
    setLoading
  };
}