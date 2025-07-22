
import { useEffect, useState } from 'react';
import { posStore } from '@/store/posStore';

export function usePOSStore() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const unsubscribe = posStore.subscribe(() => {
      forceUpdate({});
    });

    return unsubscribe;
  }, []);

  return posStore;
}
