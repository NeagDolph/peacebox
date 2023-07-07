import {useCallback, useState} from 'react';

// Hacky force update for glitchy context menu
export function useForceUpdate() {
  const [_, setTick] = useState(0);
  const update = useCallback(() => {
    setTick(tick => tick + 1);
  }, []);
  return [_, update];
}
