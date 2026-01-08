// Database types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          birth_date: string | null;
          created_at: string;
          settings: Record<string, any> | null;
        };
        Insert: {
          id: string;
          email: string;
          birth_date?: string | null;
          created_at?: string;
          settings?: Record<string, any> | null;
        };
        Update: {
          id?: string;
          email?: string;
          birth_date?: string | null;
          created_at?: string;
          settings?: Record<string, any> | null;
        };
      };
      annual_goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          year: number;
          status: 'active' | 'completed' | 'abandoned';
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          year: number;
          status?: 'active' | 'completed' | 'abandoned';
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          year?: number;
          status?: 'active' | 'completed' | 'abandoned';
          created_at?: string;
          completed_at?: string | null;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          goal_id: string | null;
          title: string;
          description: string | null;
          status: 'active' | 'parked' | 'completed' | 'abandoned';
          is_life_ops: boolean;
          position: number;
          color: string;
          created_at: string;
          archived_at: string | null;
          completion_notes: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          goal_id?: string | null;
          title: string;
          description?: string | null;
          status?: 'active' | 'parked' | 'completed' | 'abandoned';
          is_life_ops?: boolean;
          position?: number;
          color?: string;
          created_at?: string;
          archived_at?: string | null;
          completion_notes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          goal_id?: string | null;
          title?: string;
          description?: string | null;
          status?: 'active' | 'parked' | 'completed' | 'abandoned';
          is_life_ops?: boolean;
          position?: number;
          color?: string;
          created_at?: string;
          archived_at?: string | null;
          completion_notes?: string | null;
        };
      };
      tasks: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          estimated_minutes: number | null;
          status: 'pending' | 'in_progress' | 'completed' | 'skipped';
          scheduled_date: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          estimated_minutes?: number | null;
          status?: 'pending' | 'in_progress' | 'completed' | 'skipped';
          scheduled_date?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          estimated_minutes?: number | null;
          status?: 'pending' | 'in_progress' | 'completed' | 'skipped';
          scheduled_date?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
      };
      reflections: {
        Row: {
          id: string;
          user_id: string;
          week_start: string;
          week_summary: string | null;
          alignment_reflection: string | null;
          what_moved_needle: string | null;
          conscious_choices: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          week_start: string;
          week_summary?: string | null;
          alignment_reflection?: string | null;
          what_moved_needle?: string | null;
          conscious_choices?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          week_start?: string;
          week_summary?: string | null;
          alignment_reflection?: string | null;
          what_moved_needle?: string | null;
          conscious_choices?: string | null;
          created_at?: string;
        };
      };
    };
  };
};

// Application types
export interface UserProfile {
  id: string;
  email: string;
  birthDate: Date | null;
  createdAt: Date;
  settings: Record<string, any>;
}

export interface AnnualGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  year: number;
  status: 'active' | 'completed' | 'abandoned';
  createdAt: Date;
  completedAt: Date | null;
}

export interface Project {
  id: string;
  userId: string;
  goalId: string | null;
  title: string;
  description: string;
  status: 'active' | 'parked' | 'completed' | 'abandoned';
  isLifeOps: boolean;
  position: number;
  color: string;
  createdAt: Date;
  archivedAt: Date | null;
  completionNotes: string | null;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  estimatedMinutes: number | null;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  scheduledDate: Date | null;
  completedAt: Date | null;
  createdAt: Date;
}

export interface TaskWithProject extends Task {
  project: Project;
}

export interface Reflection {
  id: string;
  userId: string;
  weekStart: Date;
  weekSummary: string;
  alignmentReflection: string;
  whatMovedNeedle: string;
  consciousChoices: string;
  createdAt: Date;
}

// Project colors
export const PROJECT_COLORS = {
  sage: { DEFAULT: '#7C9885', light: '#A4BAAC', dark: '#5A7361' },
  slate: { DEFAULT: '#6B7B8C', light: '#8FA1B3', dark: '#4A5666' },
  rust: { DEFAULT: '#A8654F', light: '#C98A75', dark: '#7D4838' },
  plum: { DEFAULT: '#8B6F8F', light: '#B09AB3', dark: '#67526A' },
  teal: { DEFAULT: '#5C8A8A', light: '#7EADAD', dark: '#426666' },
  amber: { DEFAULT: '#C9A36D', light: '#D4A574', dark: '#A88554' },
} as const;

export type ProjectColorName = keyof typeof PROJECT_COLORS;
