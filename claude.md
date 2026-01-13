# Claude Context: 4000 Weeks Focus Management Application

This document provides context about the Master Planner project for Claude Code and future development sessions.

## Project Overview

**Name**: 4000 Weeks - Focus & Intentionality System
**Type**: Web application (React + TypeScript + Supabase)
**Status**: Phase 1+ ✅ ENHANCED - Goals & Focus Features Added
**Repository**: https://github.com/jimbrownnwa/Master-Planner.git
**Latest Build**: January 13, 2026 - All TypeScript errors resolved

## Core Philosophy

This application is inspired by Oliver Burkeman's book "Four Thousand Weeks" and is built around the principle that the average human lifespan is approximately 4,000 weeks. The goal is to help users make intentional choices about how to spend their finite time.

**Key Principles:**
1. **Constraint as Feature** - The 3-project limit is not a bug, it's the core value proposition
2. **No Guilt Design** - Avoid red badges, streaks, or shame indicators
3. **Reflection Over Metrics** - Focus on wisdom, not productivity points
4. **Time Language** - Frame everything as choices, not obligations

## Design Aesthetic: Contemplative Modernism

**Vision**: An interface that evokes a well-crafted journal - serious in purpose, warm in execution.

**Design System:**
- **Typography**: Crimson Pro (serif) for headings, Inter (sans) for body text
- **Colors**: Warm creams (backgrounds), burnt sienna (primary accent), amber (secondary accent)
- **Motion**: Gentle staggered animations with organic easing
- **Texture**: Subtle paper grain overlay (opacity: 0.035)
- **Signature Element**: Luminous weeks counter with amber glow in header

**Never use**:
- Cold blues or harsh blacks
- Generic fonts (Arial, Roboto, system fonts)
- Red for incomplete items
- Guilt-inducing visual language
- Purple gradients on white (generic AI aesthetic)

## Architecture

### Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS v3.4.1 (custom design tokens)
- TanStack Query (state management)
- React Router v6 (navigation)
- Lucide React (icons)
- date-fns (date utilities)

**Backend:**
- Supabase PostgreSQL
- Supabase Auth (email/password)
- Row Level Security (RLS) policies

**Important**: Always use `import type` for TypeScript type imports to avoid ES module errors.

### Folder Structure

Feature-first architecture (not layer-first):

```
src/
├── features/           # Domain-based modules
│   ├── auth/          # AuthContext, login, signup, protected routes
│   ├── weeks/         # WeeksCounter component, useWeeksCounter hook
│   ├── projects/      # Project management, 3+1 constraint logic, modals
│   ├── tasks/         # Task CRUD, scheduling, status management
│   ├── goals/         # Five Year Vision & Annual Goals (COMPLETE)
│   └── reflection/    # Weekly reflection (basic in Phase 1)
├── pages/             # Main views
│   ├── WeeklyPlanningView.tsx  # Primary workspace with Today's Focus
│   ├── GoalsProjectsView.tsx   # Strategic overview with vision & goals
│   ├── DailyFocusView.tsx      # Minimal execution
│   └── ReflectionView.tsx      # Weekly review
├── layouts/           # MainLayout with header/nav
├── components/ui/     # Reusable components (Modal, etc.)
└── lib/               # Utilities
    ├── supabase.ts    # Supabase client
    └── types.ts       # TypeScript types & Database schema
```

## Key Constraints & Rules

### The 3+1 Project Constraint

**CRITICAL**: Users can have:
- Maximum 3 active projects (non-Life-Ops)
- 1 permanent Life Ops project (always active)
- Unlimited parked projects

**Enforcement:**
- UI level: Disable "Add Project" button when at 3 active
- Application level: `canActivateProject()` validation function
- Database level: (Planned for Phase 2 - trigger)

To activate a 4th project, user must first park or complete an existing one.

### No Orphan Tasks

**CRITICAL**: Every task MUST have a `project_id`. Tasks cannot exist without a project.

**Enforcement:**
- UI level: Project selector is required when creating tasks
- Database level: `project_id` is NOT NULL with foreign key constraint
- If task doesn't fit current projects, prompt to add to parking lot as future project

### Weeks Counter Calculation

```typescript
const EXPECTED_LIFESPAN_WEEKS = 4000;
weeksLived = differenceInWeeks(today, birthDate);
weeksRemaining = max(0, EXPECTED_LIFESPAN_WEEKS - weeksLived);
percentage = (weeksLived / EXPECTED_LIFESPAN_WEEKS) * 100;
```

Birth date is stored in user profile and used to calculate this dynamically.

## Database Schema

### Key Tables

**profiles** - Extends auth.users
- birth_date (for weeks counter)
- settings (jsonb for preferences)

**projects** - User projects
- status: 'active' | 'parked' | 'completed' | 'abandoned'
- is_life_ops: boolean (true for the permanent project)
- position: integer (1-4, for ordering active projects)
- color: string (sage, slate, rust, plum, teal, amber)

**tasks** - Actionable items
- project_id: uuid NOT NULL (enforces no orphans)
- status: 'pending' | 'in_progress' | 'completed' | 'skipped'
- scheduled_date: date (for calendar view)

**annual_goals** - Yearly objectives
- title, description, year, status (active/completed/abandoned)
- Full CRUD implemented with modals
- Links to projects via goal_id foreign key
- Vision stored in profiles.settings.vision (jsonb)

**reflections** - Weekly review data
- Basic storage in Phase 1, rich analytics in Phase 2

### Row Level Security (RLS)

All tables have RLS policies ensuring users can only access their own data:
```sql
auth.uid() = user_id
```

### Auto-created Life Ops

A database trigger (`handle_new_user()`) automatically creates a Life Ops project when a user signs up:
```sql
insert into public.projects (user_id, title, description, status, is_life_ops, position)
values (new.id, 'Life Ops', 'Health, home, relationships, and daily maintenance', 'active', true, 4);
```

## State Management Patterns

### React Query (TanStack Query)

Used for all server state. Key patterns:

```typescript
// Queries
const { data, isLoading, error } = useQuery({
  queryKey: ['projects', userId],
  queryFn: async () => { /* fetch from Supabase */ },
  enabled: !!userId,
});

// Mutations
const mutation = useMutation({
  mutationFn: async (data) => { /* update Supabase */ },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  },
});
```

**Important**: Always invalidate related queries after mutations.

### Local Component State

Use `useState` for UI state that doesn't need to persist:
- Modal open/close
- Dropdown menus
- Drag states
- Form inputs (before submission)

## Common Patterns & Conventions

### Import Types

**Always** use `import type` for TypeScript types:

```typescript
// Correct
import type { Project, Task } from '../../lib/types';

// Incorrect (causes ES module errors)
import { Project, Task } from '../../lib/types';
```

### Date Handling

Always use date-fns for consistency:
```typescript
import { format, startOfWeek, addDays, differenceInWeeks } from 'date-fns';

// Week starts on Monday
startOfWeek(date, { weekStartsOn: 1 });

// Format for database
format(date, 'yyyy-MM-dd');
```

### Supabase Queries

Pattern for fetching with RLS:
```typescript
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .eq('user_id', user.id)
  .order('position', { ascending: true });
```

No need to filter by user_id in WHERE - RLS handles this, but we include it for clarity.

## UI Component Patterns

### Animations

Use staggered reveals for lists:
```tsx
{items.map((item, index) => (
  <div
    key={item.id}
    className="animate-slide-up"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    {/* content */}
  </div>
))}
```

Available delays: `animate-delay-100` through `animate-delay-500`

### Color Coding Projects

```typescript
const colorValues = PROJECT_COLORS[project.color as keyof typeof PROJECT_COLORS];

<div
  className="w-3 h-3 rounded-full"
  style={{ backgroundColor: colorValues.DEFAULT }}
/>
```

Available colors: sage, slate, rust, plum, teal, amber (each has DEFAULT, light, dark)

### Modal Pattern

```tsx
import { Modal } from '../../components/ui/Modal';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="md"
>
  {/* content */}
</Modal>
```

## Goals Section Features

### Five Year Vision

The Five Year Vision is stored in the user's profile settings as a freeform text field:

```typescript
// Stored in profiles.settings.vision
const { data: vision } = useVision(); // Fetches from settings
const updateVision = useUpdateVision(); // Updates settings.vision
```

**Components:**
- `VisionModal.tsx` - Large textarea for creating/editing vision
- `useVision.ts` - React Query hooks for fetching and updating

**UX Notes:**
- Thoughtful prompt text guides users beyond career goals
- Large 300px textarea for comfortable writing
- Saved to `profiles.settings.vision` (jsonb field)

### Annual Goals

Full CRUD functionality for yearly objectives with project linking:

```typescript
// Hooks available
useGoals() // Fetch all goals
useActiveGoals() // Fetch active goals only
useCreateGoal() // Create new goal
useUpdateGoal() // Update existing goal
useDeleteGoal() // Delete goal (with confirmation)
```

**Components:**
- `CreateGoalModal.tsx` - Create new annual goals
- `EditGoalModal.tsx` - Edit/delete with status management
- `useGoals.ts` - React Query hooks for all CRUD operations

**Features:**
- Status transitions: Active → Completed or Abandoned
- Auto-timestamps when marking completed
- Shows linked active projects under each goal
- Delete confirmation with warning about unlinking projects
- Year selector (current + next 2 years)

## Today's Focus Features

The Today's Focus panel (right side of Weekly Planning View) provides real-time task execution tracking:

### Task Status Management

Tasks have three states with visual icons:
- **Pending** (○) - Not started yet
- **In Progress** (▶) - Currently working on
- **Completed** (✓) - Finished

Click the icon to progress through states: Pending → In Progress → Completed → (back to Pending)

### Hours Display

```typescript
// Calculate hours from tasks scheduled for today
const activeTodayTasks = todayTasks.filter(
  (t) => t.status !== 'skipped' && t.status !== 'completed'
);
const todayMinutes = activeTodayTasks.reduce(
  (sum, t) => sum + (t.estimatedMinutes || 0), 0
);
const todayHours = (todayMinutes / 60).toFixed(1);
```

Shows "Hours planned or in progress" with count of active in-progress tasks.

### Task Display

- Tasks grouped by project with color coding
- Shows estimated time per task
- Visual feedback for task states (bold for in-progress, strike-through for completed)
- Click status icon to update, click task title to edit details
- Empty state with helpful message when no tasks scheduled

### Critical Bug Fix

**Issue**: useTasksByDate was receiving `new Date()` on every render, causing perpetual loading.
**Solution**: Use stable date from useState:
```typescript
const [today] = useState(() => new Date());
const { data: todayTasks } = useTasksByDate(today);
```

## Phase 1 vs Phase 2

### What's in Phase 1+ (✅ ENHANCED - January 13, 2026)

**Core Features:**
- ✅ Authentication (email/password)
- ✅ Birth date input & weeks counter
- ✅ Project management with 3+1 constraint
- ✅ Project modals (Create/Edit/Swap)
- ✅ Parking lot functionality
- ✅ Task management with scheduling and status tracking
- ✅ Weekly Planning View (3-panel layout)
- ✅ Daily Focus view
- ✅ Reflection view (basic prompts)

**NEW - Goals Section:**
- ✅ Five Year Vision with modal editor
- ✅ Annual Goals full CRUD (Create/Read/Update/Delete)
- ✅ Goal status management (Active/Completed/Abandoned)
- ✅ Goal-to-Project linking with visual display
- ✅ Delete confirmation with project unlinking warning

**NEW - Today's Focus:**
- ✅ Interactive task status tracking (Pending/In Progress/Completed)
- ✅ Real-time hours calculation for today's tasks
- ✅ Visual task states with icons (○/▶/✓)
- ✅ Task grouping by project with color coding
- ✅ Click-to-progress workflow for task execution

**Technical:**
- ✅ Build passing with 0 errors
- ✅ Stable date handling (fixed perpetual loading bug)
- ✅ Tasks default to today's date when created

### What's in Phase 2 (PLANNED)

- ⏸️ Google Calendar bidirectional sync
- ⏸️ Time blocks with specific hours (not just dates)
- ⏸️ Recurring tasks with habit tracking
- ⏸️ Guided weekly planning ritual flow
- ⏸️ Advanced analytics (project health, trends)
- ⏸️ Full Pomodoro timer in Focus mode
- ⏸️ Mobile responsive polish
- ⏸️ Database triggers for constraint enforcement
- ⏸️ Reflection history with search

**Important**: Don't add Phase 2 features without explicit request. Stay focused on Phase 1 scope.

## Common Issues & Solutions

### Tailwind CSS Class Errors

If you see "class does not exist" errors:
- Check that you're using valid Tailwind classes
- `ring-3` doesn't exist - use `ring-2`
- Custom colors must be defined in tailwind.config.js

### ES Module Import Errors

If you see "does not provide an export named X":
- Use `import type` for TypeScript types (required by verbatimModuleSyntax)
- Use regular `import` for constants and functions

### Supabase TypeScript Errors

If you see "type 'never'" errors on Supabase `.update()` calls:
- This is a known issue with strict TypeScript and Supabase type inference
- Use `@ts-expect-error - Supabase type inference issue` directive on the `.update()` line
- Cast query results to `any[]` when mapping: `(data as any[]).map((row: any) => ...)`
- Queries are still type-safe at runtime via Supabase validation

### Supabase Auth Errors

If auth isn't working:
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are in `.env`
- Ensure RLS policies are set up correctly
- Verify email confirmation is disabled (or handled) in Supabase Auth settings

## Testing Checklist

When making changes, always verify:

1. **3+1 Constraint**: Can't activate 4th non-Life-Ops project
2. **No Orphan Tasks**: Can't create task without project
3. **Weeks Counter**: Displays correctly based on birth date
4. **Goals Section**: Vision saves correctly, goals CRUD works, project linking displays
5. **Today's Focus**: Tasks appear for today, status changes work, hours calculate correctly
6. **Task Status**: Pending/In Progress/Completed icons work and update properly
7. **RLS**: Users only see their own data
8. **Animations**: Staggered reveals work smoothly
9. **Responsive**: Works on desktop (1200px+) and tablet (768px+)

## Git Workflow

```bash
# Always work in feature branches
git checkout -b feature/description

# Commit with descriptive messages
git commit -m "Add feature X to improve Y"

# Push and create PR
git push origin feature/description
```

**Commit message format:**
- Start with verb (Add, Fix, Update, Refactor)
- Be specific about what changed
- Include co-author attribution for Claude-assisted work

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Never commit `.env` to git (it's in .gitignore).

## Resources

- **Product Spec**: `Reference/4000weeks-product-spec.docx.md`
- **Design Doc**: `docs/plans/2026-01-08-4000weeks-design.md`
- **Implementation Plan**: `docs/plans/4000weeks-implementation-plan.md`
- **Phase 1 Completion Summary**: `docs/PHASE1-COMPLETION-SUMMARY.md` ✅ NEW
- **Database Schema**: `4000-weeks-app/supabase-schema.sql`

## Notes for Future Sessions

- The aesthetic is non-negotiable - maintain the warm, contemplative design
- The 3+1 constraint is the core feature - never compromise it
- Always consider the "no guilt" philosophy when adding features
- Prefer reflection over metrics
- Keep the interface focused and intentional

---

*Last updated: January 13, 2026*
*Phase 1+ build verified and passing - Goals section and Today's Focus features complete*
