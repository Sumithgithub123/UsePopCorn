import { useState, useEffect } from "react";

export function useLocalStorageState(initialstate, key) {
  const [value, setvalue] = useState(() => {
    const value = localStorage.getItem(key);
    if (!value) return initialstate;
    return JSON.parse(value);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setvalue];
}
