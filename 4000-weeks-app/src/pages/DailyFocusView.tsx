import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { useTasksByDate, useCompleteTask, useUpdateTask } from '../features/tasks/useTasks';
import { PROJECT_COLORS } from '../lib/types';

export function DailyFocusView() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { data: todayTasks = [] } = useTasksByDate(new Date());
  const completeTask = useCompleteTask();
  const updateTask = useUpdateTask();

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const pendingTasks = todayTasks.filter(
    (t) => t.status === 'pending' || t.status === 'in_progress'
  );
  const completedTasks = todayTasks.filter((t) => t.status === 'completed');
  const currentTask = pendingTasks[0];
  const upNextTasks = pendingTasks.slice(1, 4);

  const totalMinutes = todayTasks
    .filter((t) => t.status !== 'skipped')
    .reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);
  const completedMinutes = completedTasks.reduce(
    (sum, t) => sum + (t.estimatedMinutes || 0),
    0
  );
  const progress = totalMinutes > 0 ? (completedMinutes / totalMinutes) * 100 : 0;

  const handleComplete = async (taskId: string) => {
    await completeTask.mutateAsync(taskId);
  };

  const handleSkip = async (taskId: string) => {
    await updateTask.mutateAsync({
      id: taskId,
      updates: { status: 'skipped' },
    });
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-cream-100 via-amber-50/30 to-cream-100">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Current time */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="text-display font-serif text-warm-800 mb-2">
            {format(currentTime, 'h:mm')}
            <span className="text-h2 text-warm-500 ml-2">{format(currentTime, 'a')}</span>
          </div>
          <p className="text-warm-600">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>

        {/* Progress */}
        <div className="card p-6 mb-8 animate-slide-up animate-delay-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-small font-medium text-warm-700">Today's Progress</span>
            <span className="text-small text-warm-600">
              {completedTasks.length} of {todayTasks.filter((t) => t.status !== 'skipped').length}{' '}
              tasks
            </span>
          </div>
          <div className="w-full h-2 bg-warm-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current task */}
        {currentTask ? (
          <div className="card p-8 mb-8 animate-slide-up animate-delay-200">
            <div className="text-center">
              <p className="text-tiny uppercase tracking-wide text-warm-500 mb-3">Current Focus</p>

              {/* Project badge */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      PROJECT_COLORS[currentTask.project.color as keyof typeof PROJECT_COLORS]
                        ?.DEFAULT || PROJECT_COLORS.sage.DEFAULT,
                  }}
                />
                <span className="text-small text-warm-600">{currentTask.project.title}</span>
              </div>

              <h2 className="text-h2 text-warm-800 mb-6">{currentTask.title}</h2>

              {currentTask.estimatedMinutes && (
                <div className="flex items-center justify-center gap-2 text-warm-600 mb-8">
                  <Clock className="w-4 h-4" />
                  <span className="text-small">{currentTask.estimatedMinutes} minutes</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => handleComplete(currentTask.id)}
                  className="btn btn-primary px-6 py-3 flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Complete
                </button>
                <button
                  onClick={() => handleSkip(currentTask.id)}
                  className="btn btn-secondary px-6 py-3 flex items-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Skip
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-12 text-center mb-8 animate-slide-up animate-delay-200">
            {completedTasks.length > 0 ? (
              <>
                <CheckCircle className="w-16 h-16 text-sienna-500 mx-auto mb-4" />
                <h3 className="text-h3 mb-3">All done for today!</h3>
                <p className="text-warm-600">
                  You've completed all your scheduled tasks. Well done!
                </p>
              </>
            ) : (
              <>
                <Calendar className="w-16 h-16 text-warm-300 mx-auto mb-4" />
                <h3 className="text-h3 mb-3">No tasks scheduled</h3>
                <p className="text-warm-600 mb-6">
                  Head to the Weekly view to schedule tasks for today
                </p>
              </>
            )}
          </div>
        )}

        {/* Up next */}
        {upNextTasks.length > 0 && (
          <div className="animate-slide-up animate-delay-300">
            <h3 className="text-h4 mb-4 text-center text-warm-700">Up Next</h3>
            <div className="space-y-3">
              {upNextTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="card p-4 flex items-center gap-4"
                  style={{ animationDelay: `${(index + 4) * 100}ms` }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-small font-medium"
                    style={{
                      backgroundColor:
                        PROJECT_COLORS[task.project.color as keyof typeof PROJECT_COLORS]?.light +
                          '40' || PROJECT_COLORS.sage.light + '40',
                      color:
                        PROJECT_COLORS[task.project.color as keyof typeof PROJECT_COLORS]?.dark ||
                        PROJECT_COLORS.sage.dark,
                    }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-small font-medium text-warm-800 truncate">{task.title}</p>
                    <p className="text-tiny text-warm-500">{task.project.title}</p>
                  </div>
                  {task.estimatedMinutes && (
                    <div className="text-tiny text-warm-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {task.estimatedMinutes}m
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
