import { useDroppable } from '@dnd-kit/core';
import { format } from 'date-fns';

interface TimeSlotProps {
  slotDate: Date;
  isHour: boolean;
  slotIndex: number;
}

export function TimeSlot({ slotDate, isHour, slotIndex }: TimeSlotProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${slotIndex}`,
    data: { slotDate, slotIndex },
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative border-t border-warm-200 transition-colors ${
        isOver ? 'bg-amber-50' : ''
      }`}
      style={{ height: '60px' }} // 30 minutes
    >
      {isHour && (
        <div className="absolute left-0 top-0 -translate-y-1/2 text-tiny text-warm-600 w-16 text-right pr-2">
          {format(slotDate, 'h:mm a')}
        </div>
      )}
    </div>
  );
}
