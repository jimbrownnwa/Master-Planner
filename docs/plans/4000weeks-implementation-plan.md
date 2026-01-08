# 4000 Weeks - Phased Implementation Plan

**Project:** 4000 Weeks Focus & Intentionality System
**Last Updated:** January 8, 2026

## Phase 1: Core Workflow Prototype

### Objective
Build a functional single-user application demonstrating the core 3+1 project constraint philosophy with Supabase backend integration.

### Setup & Infrastructure

**1.1 Project Initialization**
- [ ] Create Vite + React + TypeScript project
- [ ] Configure Tailwind CSS
- [ ] Install and configure shadcn/ui components
- [ ] Set up React Query (TanStack Query)
- [ ] Configure Supabase client
- [ ] Set up ESLint and Prettier
- [ ] Create environment variable configuration

**1.2 Supabase Schema**
- [ ] Create users table extension (birth_date, settings)
- [ ] Create annual_goals table
- [ ] Create projects table with status enum
- [ ] Create tasks table with foreign key to projects
- [ ] Set up Row Level Security (RLS) policies
- [ ] Create indexes for common queries
- [ ] Write seed data for development

### Core Features - Authentication & User Setup

**1.3 Authentication Flow**
- [ ] Login page with email/password
- [ ] Signup page with email/password
- [ ] Protected route wrapper component
- [ ] Auth context/hook (useAuth)
- [ ] Logout functionality
- [ ] Password reset flow (basic)

**1.4 User Onboarding**
- [ ] Birth date input modal (first-time users)
- [ ] Save birth date to user profile
- [ ] Welcome tour overlay (3-step intro)
- [ ] Skip tour option with localStorage persistence

### Core Features - Weeks Counter

**1.5 Weeks Calculation Logic**
- [ ] `calculateWeeksLived(birthDate)` utility function
- [ ] `calculateWeeksRemaining(birthDate, expectedLifespan)` function
- [ ] `useWeeksCounter()` hook with React Query
- [ ] Handle edge cases (future birth dates, very old ages)

**1.6 Weeks Counter UI**
- [ ] WeeksCounter component for header
- [ ] Format: "Week 2,347 of ~4,000"
- [ ] Responsive display (hide on mobile, show on hover)
- [ ] Tooltip with additional context

### Core Features - Projects

**1.7 Project Data Layer**
- [ ] `useProjects()` query hook (fetch all projects)
- [ ] `useActiveProjects()` filtered query (status = active)
- [ ] `useParkedProjects()` filtered query (status = parked)
- [ ] `useCreateProject()` mutation hook
- [ ] `useUpdateProject()` mutation hook
- [ ] `useDeleteProject()` mutation hook
- [ ] `useUpdateProjectStatus()` mutation (activate/park/complete)

**1.8 Project Constraint Logic**
- [ ] `canActivateProject()` validation function (checks if < 3 active)
- [ ] `swapProjects(projectToActivate, projectToPark)` function
- [ ] Life Ops auto-creation on user signup
- [ ] Position management (1-4 ordering)

**1.9 Project UI Components**
- [ ] ProjectCard component (active state)
- [ ] ProjectCard component (parked state)
- [ ] ProjectList component
- [ ] ProjectSlotManager (visual 3+1 slots)
- [ ] CreateProjectModal
- [ ] EditProjectModal
- [ ] SwapProjectModal (choose which to park)
- [ ] ProjectEmptyState component

### Core Features - Tasks

**1.10 Task Data Layer**
- [ ] `useTasks(projectId)` query hook
- [ ] `useTasksByDate(date)` query hook
- [ ] `useCreateTask()` mutation with project_id validation
- [ ] `useUpdateTask()` mutation
- [ ] `useDeleteTask()` mutation
- [ ] `useCompleteTask()` mutation (sets status + timestamp)

**1.11 Task UI Components**
- [ ] TaskItem component (checkbox, title, time, project badge)
- [ ] TaskList component
- [ ] CreateTaskModal with project selector
- [ ] EditTaskModal
- [ ] TaskEmptyState
- [ ] QuickAddTask inline form

### Core Features - Weekly Planning View

**1.12 Calendar Logic**
- [ ] `getWeekDates(startDate)` utility function
- [ ] `useWeekCalendar(weekStart)` query hook
- [ ] Week navigation state management
- [ ] "Today" quick jump function

**1.13 Calendar UI**
- [ ] WeekCalendar component (7-day grid)
- [ ] DayColumn component
- [ ] TimeBlock component (scheduled task display)
- [ ] Week navigation controls (Prev/Today/Next)
- [ ] Empty day state

**1.14 Three-Panel Layout**
- [ ] WeeklyPlanningView main page
- [ ] LeftPanel: Active projects list with tasks
- [ ] CenterPanel: Week calendar
- [ ] RightPanel: Today's focus
- [ ] Responsive collapse/expand for panels

**1.15 Basic Time Blocking**
- [ ] Task scheduling (assign task to date)
- [ ] Time slot selection (simplified - just date for Phase 1)
- [ ] Visual indication of scheduled vs. unscheduled tasks
- [ ] Reschedule task (drag to different day - basic version)

### Core Features - Goals & Projects View

**1.16 Goals Data Layer**
- [ ] `useAnnualGoals(year)` query hook
- [ ] `useCreateGoal()` mutation
- [ ] `useUpdateGoal()` mutation
- [ ] `useDeleteGoal()` mutation

**1.17 Goals & Projects UI**
- [ ] GoalsProjectsView main page
- [ ] VisionStatement component (editable textarea)
- [ ] GoalCard component
- [ ] GoalsList grid layout
- [ ] CreateGoalModal
- [ ] EditGoalModal
- [ ] Link project to goal (dropdown selector)
- [ ] Active projects visual representation
- [ ] Parking lot collapsible section

### Core Features - Daily Focus View

**1.18 Daily Focus UI**
- [ ] DailyFocusView main page
- [ ] Current time block highlight (based on scheduled_date = today)
- [ ] Next up section (next 2-3 scheduled items)
- [ ] Task actions: Complete / Skip / Defer
- [ ] Focus mode toggle (hides nav/header)
- [ ] Timer display (optional, basic countdown)

### Core Features - Reflection View

**1.19 Reflection Data Layer**
- [ ] Create reflections table in Supabase
- [ ] `useWeekReflections()` query hook
- [ ] `useCreateReflection()` mutation
- [ ] Weekly summary calculation (hours by project)

**1.20 Reflection UI**
- [ ] ReflectionView main page
- [ ] Week selector
- [ ] Summary card (hours committed, tasks completed)
- [ ] Reflection prompts (textarea inputs)
- [ ] Save reflection
- [ ] Historical reflections list (collapsible cards)

### UI/UX Polish

**1.21 Navigation & Layout**
- [ ] App header with logo, nav tabs, weeks counter, user menu
- [ ] Main navigation: Weekly | Goals | Focus | Reflect
- [ ] User menu dropdown: Settings | Logout
- [ ] Page transitions
- [ ] Loading states for all queries
- [ ] Error states with retry buttons

**1.22 Design System**
- [ ] Color palette configuration (calm neutrals)
- [ ] Project accent color picker (6-8 preset colors)
- [ ] Typography scale
- [ ] Spacing system
- [ ] Button variants
- [ ] Input field styling
- [ ] Modal/dialog patterns

**1.23 Responsive Design (Desktop + Tablet)**
- [ ] Desktop layout (1200px+): Full 3-panel
- [ ] Tablet layout (768-1199px): Collapsible panels
- [ ] Mobile layout (<768px): Single panel with bottom nav (basic usability)

### Testing & Deployment Prep

**1.24 Testing**
- [ ] Manual testing checklist for all user flows
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Test constraint enforcement (can't activate 4th project)
- [ ] Test orphan task prevention (task requires project)
- [ ] Test weeks counter calculation accuracy

**1.25 Deployment Setup**
- [ ] Create Vercel project
- [ ] Configure environment variables in Vercel
- [ ] Set up production Supabase project
- [ ] Deploy and test production build
- [ ] Set up custom domain (optional)

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
