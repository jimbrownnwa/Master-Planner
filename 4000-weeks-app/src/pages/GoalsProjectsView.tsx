import { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import { useActiveProjects, useParkedProjects } from '../features/projects/useProjects';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../features/auth/AuthContext';
import { PROJECT_COLORS } from '../lib/types';

export function GoalsProjectsView() {
  const { user } = useAuth();
  const { data: activeProjects = [] } = useActiveProjects();
  const { data: parkedProjects = [] } = useParkedProjects();

  // Fetch annual goals
  const { data: goals = [] } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('annual_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch user profile for vision
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('settings')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const vision = profile?.settings?.vision || '';
  const [isEditingVision, setIsEditingVision] = useState(false);
  const [visionText, setVisionText] = useState(vision);

  const activeNonLifeOps = activeProjects.filter((p) => !p.isLifeOps);
  const emptySlots = 3 - activeNonLifeOps.length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Vision Statement */}
      <div className="mb-12 animate-fade-in">
        <div className="card p-6">
          <h2 className="text-h3 mb-4 flex items-center gap-2">
            <span>Your 5+ Year Vision</span>
            <button className="btn btn-ghost text-tiny px-2 py-1">Edit</button>
          </h2>

          {vision ? (
            <div className="prose prose-sm max-w-none">
              <p className="text-body text-warm-700 leading-relaxed whitespace-pre-wrap">
                {vision}
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-warm-500 mb-4">
                Where do you want your life to be in 5+ years?
              </p>
              <button className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Your Vision
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Annual Goals */}
      <div className="mb-12 animate-slide-up animate-delay-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-h2">2026 Goals</h2>
            <p className="text-small text-warm-600">What do you want to accomplish this year?</p>
          </div>
          <button className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </button>
        </div>

        {goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal, index) => {
              const linkedProjects = activeProjects.filter((p) => p.goalId === goal.id);

              return (
                <div
                  key={goal.id}
                  className="card p-6 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-sienna-100 rounded-button flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-sienna-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-h4 mb-2">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-small text-warm-600 mb-3">{goal.description}</p>
                      )}

                      {linkedProjects.length > 0 && (
                        <div>
                          <p className="text-tiny text-warm-500 mb-2">Active projects:</p>
                          <div className="flex flex-wrap gap-2">
                            {linkedProjects.map((project) => (
                              <div
                                key={project.id}
                                className="flex items-center gap-1.5 px-2.5 py-1 bg-warm-50 rounded-button"
                              >
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{
                                    backgroundColor:
                                      PROJECT_COLORS[
                                        project.color as keyof typeof PROJECT_COLORS
                                      ]?.DEFAULT || PROJECT_COLORS.sage.DEFAULT,
                                  }}
                                />
                                <span className="text-tiny text-warm-700">{project.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <Target className="w-12 h-12 text-warm-300 mx-auto mb-4" />
            <p className="text-warm-500 mb-4">No annual goals yet</p>
            <p className="text-small text-warm-400 mb-6">
              Set clear objectives for the year to guide your project choices
            </p>
            <button className="btn btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Goal
            </button>
          </div>
        )}
      </div>

      {/* Active Projects - Visual Slots */}
      <div className="mb-12 animate-slide-up animate-delay-200">
        <h2 className="text-h2 mb-6">Active Projects (3 + Life Ops)</h2>

        <div className="grid grid-cols-4 gap-4">
          {/* Active project slots */}
          {activeNonLifeOps.map((project, index) => (
            <div key={project.id} className="card p-6">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      PROJECT_COLORS[project.color as keyof typeof PROJECT_COLORS]?.DEFAULT ||
                      PROJECT_COLORS.sage.DEFAULT,
                  }}
                />
                <span className="text-tiny text-warm-500">Slot {index + 1}</span>
              </div>
              <h3 className="text-h4 mb-2">{project.title}</h3>
              {project.description && (
                <p className="text-small text-warm-600 line-clamp-2">{project.description}</p>
              )}
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: emptySlots }).map((_, index) => (
            <div key={`empty-${index}`} className="card p-6 border-dashed">
              <div className="text-center py-4">
                <p className="text-tiny text-warm-400 mb-3">Slot {activeNonLifeOps.length + index + 1}</p>
                <button className="btn btn-ghost text-small">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Project
                </button>
              </div>
            </div>
          ))}

          {/* Life Ops (always active) */}
          {activeProjects.filter((p) => p.isLifeOps).map((project) => (
            <div key={project.id} className="card p-6 bg-amber-50/50 border-amber-200">
              <div className="mb-3">
                <span className="badge bg-amber-100 text-amber-700 text-tiny">Always Active</span>
              </div>
              <h3 className="text-h4 mb-2">{project.title}</h3>
              {project.description && (
                <p className="text-small text-warm-600 line-clamp-2">{project.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Parking Lot */}
      {parkedProjects.length > 0 && (
        <div className="animate-slide-up animate-delay-300">
          <h2 className="text-h2 mb-6">
            Parking Lot <span className="text-warm-500">({parkedProjects.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parkedProjects.map((project) => (
              <div key={project.id} className="card p-6 bg-warm-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          PROJECT_COLORS[project.color as keyof typeof PROJECT_COLORS]?.DEFAULT ||
                          PROJECT_COLORS.sage.DEFAULT,
                      }}
                    />
                    <h3 className="text-h4">{project.title}</h3>
                  </div>
                  <button className="btn btn-secondary text-tiny px-3 py-1">Activate</button>
                </div>
                {project.description && (
                  <p className="text-small text-warm-600">{project.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
