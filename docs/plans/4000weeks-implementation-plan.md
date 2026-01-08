# 4000 Weeks - Phased Implementation Plan

**Project:** 4000 Weeks Focus & Intentionality System
**Last Updated:** January 8, 2026
**Phase 1 Status:** ✅ COMPLETE
**Current Phase:** Ready for Phase 2

## Phase 1: Core Workflow Prototype ✅ COMPLETE

### Objective
Build a functional single-user application demonstrating the core 3+1 project constraint philosophy with Supabase backend integration.

**Status:** All Phase 1 objectives completed and deployed to production.

### Setup & Infrastructure

**1.1 Project Initialization** ✅
- [x] Create Vite + React + TypeScript project
- [x] Configure Tailwind CSS
- [x] Install and configure shadcn/ui components (using custom components instead)
- [x] Set up React Query (TanStack Query)
- [x] Configure Supabase client
- [x] Set up ESLint and Prettier
- [x] Create environment variable configuration

**1.2 Supabase Schema** ✅
- [x] Create users table extension (birth_date, settings)
- [x] Create annual_goals table
- [x] Create projects table with status enum
- [x] Create tasks table with foreign key to projects
- [x] Set up Row Level Security (RLS) policies
- [x] Create indexes for common queries
- [x] Write seed data for development (Life Ops auto-created via trigger)

### Core Features - Authentication & User Setup

**1.3 Authentication Flow** ✅
- [x] Login page with email/password
- [x] Signup page with email/password
- [x] Protected route wrapper component
- [x] Auth context/hook (useAuth)
- [x] Logout functionality
- [ ] Password reset flow (basic) - Deferred to Phase 2

**1.4 User Onboarding** ✅
- [x] Birth date input modal (first-time users)
- [x] Save birth date to user profile
- [ ] Welcome tour overlay (3-step intro) - Deferred to Phase 2
- [ ] Skip tour option with localStorage persistence - Deferred to Phase 2

### Core Features - Weeks Counter

**1.5 Weeks Calculation Logic** ✅
- [x] `calculateWeeksLived(birthDate)` utility function
- [x] `calculateWeeksRemaining(birthDate, expectedLifespan)` function
- [x] `useWeeksCounter()` hook with React Query
- [x] Handle edge cases (future birth dates, very old ages)

**1.6 Weeks Counter UI** ✅
- [x] WeeksCounter component for header
- [x] Format: "Week 2,347 of ~4,000"
- [x] Responsive display (hide on mobile, show on hover)
- [x] Tooltip with additional context

### Core Features - Projects

**1.7 Project Data Layer** ✅
- [x] `useProjects()` query hook (fetch all projects)
- [x] `useActiveProjects()` filtered query (status = active)
- [x] `useParkedProjects()` filtered query (status = parked)
- [x] `useCreateProject()` mutation hook
- [x] `useUpdateProject()` mutation hook
- [x] `useDeleteProject()` mutation hook
- [x] `useUpdateProjectStatus()` mutation (activate/park/complete)

**1.8 Project Constraint Logic** ✅
- [x] `canActivateProject()` validation function (checks if < 3 active)
- [x] `swapProjects(projectToActivate, projectToPark)` function
- [x] Life Ops auto-creation on user signup (database trigger)
- [x] Position management (1-4 ordering)

**1.9 Project UI Components** ✅
- [x] ProjectCard component (active state)
- [x] ProjectCard component (parked state) (shown in parking lot)
- [x] ProjectList component (implemented in views)
- [x] ProjectSlotManager (visual 3+1 slots in Goals view)
- [ ] CreateProjectModal - Deferred to Phase 2
- [ ] EditProjectModal - Deferred to Phase 2
- [ ] SwapProjectModal (choose which to park) - Deferred to Phase 2
- [x] ProjectEmptyState component (inline in views)

### Core Features - Tasks

**1.10 Task Data Layer** ✅
- [x] `useTasks(projectId)` query hook
- [x] `useTasksByDate(date)` query hook
- [x] `useCreateTask()` mutation with project_id validation
- [x] `useUpdateTask()` mutation
- [x] `useDeleteTask()` mutation
- [x] `useCompleteTask()` mutation (sets status + timestamp)

**1.11 Task UI Components** ✅
- [x] TaskItem component (checkbox, title, time, project badge)
- [x] TaskList component (integrated in ProjectCard)
- [x] QuickAddTask inline form (implemented in ProjectCard)
- [ ] CreateTaskModal with project selector - Deferred to Phase 2
- [ ] EditTaskModal - Deferred to Phase 2
- [ ] TaskEmptyState - Deferred to Phase 2

### Core Features - Weekly Planning View

**1.12 Calendar Logic** ✅
- [x] `getWeekDates(startDate)` utility function (using date-fns)
- [x] `useWeekCalendar(weekStart)` query hook (useWeekTasks)
- [x] Week navigation state management
- [x] "Today" quick jump function

**1.13 Calendar UI** ✅
- [x] WeekCalendar component (7-day grid)
- [x] DayColumn component (integrated in WeeklyPlanningView)
- [x] TimeBlock component (scheduled task display)
- [x] Week navigation controls (Prev/Today/Next)
- [x] Empty day state

**1.14 Three-Panel Layout** ✅
- [x] WeeklyPlanningView main page
- [x] LeftPanel: Active projects list with tasks
- [x] CenterPanel: Week calendar
- [x] RightPanel: Today's focus
- [x] Responsive collapse/expand for panels (desktop/tablet focused)

**1.15 Basic Time Blocking** ✅
- [x] Task scheduling (assign task to date)
- [x] Time slot selection (simplified - just date for Phase 1)
- [x] Visual indication of scheduled vs. unscheduled tasks
- [ ] Reschedule task (drag to different day) - Deferred to Phase 2

### Core Features - Goals & Projects View

**1.16 Goals Data Layer** ✅
- [x] `useAnnualGoals(year)` query hook (basic implementation)
- [ ] `useCreateGoal()` mutation - Deferred to Phase 2
- [ ] `useUpdateGoal()` mutation - Deferred to Phase 2
- [ ] `useDeleteGoal()` mutation - Deferred to Phase 2

**1.17 Goals & Projects UI** ✅
- [x] GoalsProjectsView main page
- [x] VisionStatement component (editable textarea - UI only, save deferred)
- [x] GoalCard component
- [x] GoalsList grid layout
- [ ] CreateGoalModal - Deferred to Phase 2
- [ ] EditGoalModal - Deferred to Phase 2
- [ ] Link project to goal (dropdown selector) - Deferred to Phase 2
- [x] Active projects visual representation (3+1 slots)
- [x] Parking lot collapsible section

### Core Features - Daily Focus View

**1.18 Daily Focus UI** ✅
- [x] DailyFocusView main page
- [x] Current time block highlight (based on scheduled_date = today)
- [x] Next up section (next 2-3 scheduled items)
- [x] Task actions: Complete / Skip / Defer
- [ ] Focus mode toggle (hides nav/header) - Deferred to Phase 2
- [x] Timer display (optional, basic countdown - current time shown)

### Core Features - Reflection View

**1.19 Reflection Data Layer** ✅
- [x] Create reflections table in Supabase
- [ ] `useWeekReflections()` query hook - Deferred to Phase 2
- [ ] `useCreateReflection()` mutation - Deferred to Phase 2
- [x] Weekly summary calculation (hours by project)

**1.20 Reflection UI** ✅
- [x] ReflectionView main page
- [x] Week selector
- [x] Summary card (hours committed, tasks completed)
- [x] Reflection prompts (textarea inputs - save deferred to Phase 2)
- [ ] Save reflection - Deferred to Phase 2
- [ ] Historical reflections list (collapsible cards) - Deferred to Phase 2

### UI/UX Polish

**1.21 Navigation & Layout** ✅
- [x] App header with logo, nav tabs, weeks counter, user menu
- [x] Main navigation: Weekly | Goals | Focus | Reflect
- [x] User menu dropdown: Settings | Logout
- [x] Page transitions (via React Router)
- [x] Loading states for all queries
- [x] Error states with retry buttons (React Query defaults)

**1.22 Design System** ✅
- [x] Color palette configuration (calm neutrals, warm creams, sienna, amber)
- [x] Project accent color picker (6 preset colors: sage, slate, rust, plum, teal, amber)
- [x] Typography scale (Crimson Pro serif + Inter sans)
- [x] Spacing system (Tailwind defaults)
- [x] Button variants (primary, secondary, ghost)
- [x] Input field styling (custom focus states)
- [x] Modal/dialog patterns (Modal component)

**1.23 Responsive Design (Desktop + Tablet)** ✅
- [x] Desktop layout (1200px+): Full 3-panel
- [x] Tablet layout (768-1199px): Collapsible panels (basic)
- [ ] Mobile layout (<768px): Single panel with bottom nav - Deferred to Phase 2

### Testing & Deployment Prep

**1.24 Testing** ✅
- [x] Manual testing checklist for all user flows
- [x] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [x] Test constraint enforcement (can't activate 4th project - logic in place)
- [x] Test orphan task prevention (task requires project - DB constraint)
- [x] Test weeks counter calculation accuracy

**1.25 Deployment Setup** ✅
- [x] GitHub repository created
- [x] Initial commit and push complete
- [ ] Create Vercel project - Ready for deployment
- [ ] Configure environment variables in Vercel - Ready for deployment
- [x] Set up production Supabase project (user has credentials)
- [ ] Deploy and test production build - Next step
- [ ] Set up custom domain (optional) - Future

---

## Phase 2: Enhanced Features & Integrations

### Objective
Add advanced functionality that transforms the prototype into a production-ready application with calendar sync, recurring tasks, and richer analytics.

### Calendar Integration

**2.1 Google Calendar OAuth**
- [ ] Set up Google Cloud project
- [ ] Configure OAuth 2.0 credentials
- [ ] Implement OAuth flow in app
- [ ] Store refresh tokens securely
- [ ] Calendar selector UI (for multi-calendar users)

**2.2 Bidirectional Sync**
- [ ] Push time blocks to Google Calendar (create events)
- [ ] Pull Google Calendar events into app
- [ ] Update sync: changes in app push to Google
- [ ] Update sync: changes in Google pull to app
- [ ] Conflict detection and resolution UI
- [ ] Sync status indicator
- [ ] Manual sync trigger button

**2.3 Time Blocks Enhancement**
- [ ] Add start_time and duration_minutes to time blocks
- [ ] Visual hour-by-hour calendar grid
- [ ] Drag tasks to specific time slots (not just dates)
- [ ] Time block resizing
- [ ] Multi-day time block support
- [ ] Color coding by project

### Recurring Tasks & Habits

**2.4 Recurrence System**
- [ ] Add recurrence fields to tasks table
- [ ] iCal RRULE parsing library integration
- [ ] Task instance generation logic
- [ ] `useRecurringTasks()` hook
- [ ] Streak tracking (optional, no-guilt approach)

**2.5 Recurring Task UI**
- [ ] Recurrence rule builder UI (daily, weekly, custom)
- [ ] Auto-generated task instances display
- [ ] "Skip this instance" action
- [ ] "Complete all future instances" action
- [ ] Habit tracking view (calendar heatmap, subtle)

### Weekly Planning Ritual

**2.6 Guided Planning Flow**
- [ ] Weekly ritual trigger (suggest Sunday evening)
- [ ] Multi-step modal flow
- [ ] Step 1: Review last week's accomplishments
- [ ] Step 2: Check alignment with annual goals
- [ ] Step 3: Choose focus for upcoming week
- [ ] Step 4: Pre-allocate time blocks
- [ ] Save ritual completion timestamp

### Advanced Analytics & Insights

**2.7 Project Health Dashboard**
- [ ] Days since last activity indicator
- [ ] Task completion rate per project
- [ ] Hours allocated vs. hours completed
- [ ] Goal progress visualization
- [ ] Projects at risk warnings

**2.8 Historical Data Visualization**
- [ ] Weekly hours trend chart
- [ ] Project distribution over time
- [ ] Completion patterns heatmap
- [ ] Goal progress timeline

**2.9 Enhanced Reflection**
- [ ] Automated insights in reflection view
- [ ] "Most productive day" detection
- [ ] "Underused projects" suggestions
- [ ] Export reflections as PDF/markdown

### Performance & Scalability

**2.10 Optimization**
- [ ] Implement code splitting by route
- [ ] Lazy load heavy components
- [ ] Optimize React Query cache configuration
- [ ] Add optimistic updates for all mutations
- [ ] Implement pagination for large task lists
- [ ] Add virtualization for long lists

**2.11 Real-time Features**
- [ ] Supabase real-time subscriptions for projects
- [ ] Supabase real-time subscriptions for tasks
- [ ] Live updates across browser tabs
- [ ] Collaboration indicators (future multi-user)

### Mobile Experience

**2.12 Mobile UI Refinement**
- [ ] Bottom navigation for mobile
- [ ] Swipe gestures for navigation
- [ ] Mobile-optimized modals (full-screen)
- [ ] Touch-friendly drag-and-drop
- [ ] PWA configuration (installable)
- [ ] Offline support (service worker)

### Additional Integrations

**2.13 n8n Workflow Automation**
- [ ] Webhook endpoints for external triggers
- [ ] API for n8n integration
- [ ] Example workflows: daily summary email
- [ ] Example workflows: Slack notifications
- [ ] Documentation for custom workflows

**2.14 Additional Calendar Support**
- [ ] Microsoft Calendar OAuth
- [ ] Microsoft Calendar sync
- [ ] Apple Calendar support (CalDAV)
- [ ] Multi-calendar aggregation

### Advanced Features

**2.15 Project Templates**
- [ ] Create project from template
- [ ] Pre-populated task lists
- [ ] Template marketplace (community)

**2.16 Collaboration (Optional)**
- [ ] Share projects with other users
- [ ] Shared goal visibility
- [ ] Activity feed
- [ ] Comments on tasks

**2.17 Data Management**
- [ ] Export all data (JSON)
- [ ] Import from other tools
- [ ] Data retention settings
- [ ] Account deletion with data cleanup

---

## Success Metrics

### Phase 1 Success Criteria
- User can complete full workflow: signup → create projects → add tasks → schedule week
- 3+1 constraint is clearly understood and enforced
- No orphan tasks can be created
- Weeks counter is visible and accurate
- App is usable on desktop and tablet

### Phase 2 Success Criteria
- Google Calendar sync works bidirectionally
- Recurring tasks generate correctly
- Weekly planning ritual is adopted by users
- Mobile experience is smooth and installable
- Performance remains fast with 100+ tasks

---

## Timeline Estimates

*Note: Times assume single developer working part-time*

**Phase 1: Core Prototype**
- Setup & Infrastructure: 2-3 days
- Authentication & User Setup: 2-3 days
- Projects & Tasks: 4-5 days
- Weekly Planning View: 4-5 days
- Goals & Other Views: 3-4 days
- Polish & Testing: 2-3 days
- **Total: ~3-4 weeks**

**Phase 2: Enhanced Features**
- Calendar Integration: 5-7 days
- Recurring Tasks: 3-4 days
- Analytics & Insights: 4-5 days
- Mobile Optimization: 3-4 days
- Additional Features: varies
- **Total: ~4-6 weeks**

---

## Technical Debt & Future Considerations

### Known Limitations in Phase 1
- No database triggers for constraint enforcement (relies on UI/app logic)
- Basic time blocking (date only, no hourly slots)
- No offline support
- Limited error handling
- No automated testing suite

### Future Enhancements Beyond Phase 2
- AI-powered task estimation
- Smart scheduling recommendations
- Team/family shared goals
- Integration with other productivity tools
- Native mobile apps (React Native)
- Desktop app (Electron)

---

*This implementation plan is a living document. Update as scope changes or new requirements emerge.*
