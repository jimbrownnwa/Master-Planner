import { useMemo } from 'react';
import { isToday, setHours, setMinutes } from 'date-fns';
import { TimeSlot } from './TimeSlot';
import { CurrentTimeIndicator } from './CurrentTimeIndicator';
import { HOUR_RANGE_START, HOUR_RANGE_END } from '../../lib/dnd-utils';

interface TimeGridProps {
  date: Date;
}

export function TimeGrid({ date }: TimeGridProps) {
  // Generate time slots (30-minute intervals)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = HOUR_RANGE_START; hour < HOUR_RANGE_END; hour++) {
      slots.push({ hour, minute: 0 });
      slots.push({ hour, minute: 30 });
    }
    return slots;
  }, []);

  const isTodayDate = isToday(date);

  return (
    <div className="relative pl-20">
      {/* Time labels and grid */}
      {timeSlots.map((slot, index) => {
        const slotDate = setMinutes(setHours(date, slot.hour), slot.minute);
        const isHour = slot.minute === 0;

        return (
          <TimeSlot
            key={index}
            slotDate={slotDate}
            isHour={isHour}
            slotIndex={index}
          />
        );
      })}

      {/* Current time indicator */}
      {isTodayDate && <CurrentTimeIndicator />}
    </div>
  );
}
