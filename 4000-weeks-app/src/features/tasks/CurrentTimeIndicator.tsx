import { useMemo, useEffect, useState } from 'react';
import { calculateTopOffset, isTimeInRange } from '../../lib/dnd-utils';

export function CurrentTimeIndicator() {
  const [now, setNow] = useState(new Date());

  // Update every minute
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const topOffset = useMemo(() => {
    // Check if current time is within displayable range
    if (!isTimeInRange(now)) return null;

    return calculateTopOffset(now);
  }, [now]);

  if (topOffset === null) return null;

  return (
    <div
      className="absolute left-0 right-0 flex items-center pointer-events-none z-10"
      style={{ top: `${topOffset}px` }}
    >
      <div className="w-2.5 h-2.5 rounded-full bg-amber-500 -ml-1" />
      <div className="flex-1 h-0.5 bg-amber-400" />
    </div>
  );
}
