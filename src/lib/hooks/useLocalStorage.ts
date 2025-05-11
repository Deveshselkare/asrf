import { useState, useEffect, useCallback } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      } else {
        window.localStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
      }
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    if (!isClient) {
      return;
    }

    let newValue;
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        newValue = JSON.parse(item);
      } else {
        window.localStorage.setItem(key, JSON.stringify(initialValue));
        newValue = initialValue;
      }
    } catch (error) {
      newValue = initialValue;
    }

    if (JSON.stringify(storedValue) !== JSON.stringify(newValue)) {
      setStoredValue(newValue);
    }
    // This effect depends on `key` and `isClient`.
    // `initialValue` (from closure) is used if a new key needs seeding.
    // `storedValue` (from closure) is used for comparison.
    // Neither `initialValue` nor `storedValue` are direct dependencies of this
    // effect, which prevents loops caused by unstable `initialValue` references.
  }, [key, isClient]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      if (!isClient) return;
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        // Error during setValue can be handled here if necessary
      }
    },
    [key, storedValue, isClient] 
  );

  return [storedValue, setValue];
}

export default useLocalStorage;
