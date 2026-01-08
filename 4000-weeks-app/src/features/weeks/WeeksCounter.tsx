import { useWeeksCounter } from './useWeeksCounter';

export function WeeksCounter() {
  const { data: weeksData, isLoading } = useWeeksCounter();

  if (isLoading || !weeksData || weeksData.birthDate === null) {
    return null;
  }

  const { weeksLived, totalWeeks, percentage } = weeksData;

  return (
    <div className="flex items-center gap-3 group">
      {/* Progress bar */}
      <div className="relative w-32 h-1.5 bg-warm-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(212,165,116,0.6)]"
          style={{ width: `${percentage}%` }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
        </div>
      </div>

      {/* Text */}
      <div className="text-right">
        <p className="text-tiny font-medium text-warm-600 leading-none">
          Week <span className="text-amber-600 font-semibold">{weeksLived.toLocaleString()}</span> of ~{totalWeeks.toLocaleString()}
        </p>
      </div>

      {/* Tooltip on hover */}
      <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-warm-800 text-white rounded-button shadow-soft-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
        <p className="text-tiny leading-relaxed">
          You've lived approximately <strong>{weeksLived.toLocaleString()} weeks</strong>.
          {weeksData.weeksRemaining > 0 && (
            <> About <strong>{weeksData.weeksRemaining.toLocaleString()} weeks</strong> remain if you live to 80.</>
          )}
        </p>
        <p className="text-tiny text-warm-400 mt-2 italic">
          Every planning session happens in the context of finite time.
        </p>
      </div>
    </div>
  );
}
