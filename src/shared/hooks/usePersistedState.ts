import { useEffect, useState } from "react";

export default function usePersistedState<T>(key: string, initialState: T) {
  const [state, setState] = useState<T>(() => {
    const jsonValue = localStorage.getItem(key);
    return jsonValue !== null
      ? JSON.parse(jsonValue)
      : initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
}