# 4000 Weeks - Focus & Intentionality System

A strategic focus management application inspired by Oliver Burkeman's "Four Thousand Weeks." This app enforces intentional alignment between daily activities and long-term goals through meaningful constraints.

## ✨ Key Features

- **Weeks Counter**: Persistent reminder of finite time (Week X of ~4,000)
- **3+1 Project Constraint**: Maximum 3 active projects + permanent Life Ops
- **No Orphan Tasks**: Every task must belong to a project
- **Weekly Planning View**: Three-panel workspace for strategic time allocation
- **Daily Focus Mode**: Minimal execution interface without distractions
- **Reflection System**: Weekly review prompts for building wisdom

## 🎨 Design Philosophy

**Contemplative Modernism**: Warm minimalism with editorial clarity. The interface evokes a well-crafted journal - serious in purpose, warm in execution, with every element intentionally placed.

- **Typography**: Crimson Pro (editorial serif) + Inter (refined sans)
- **Palette**: Warm creams, burnt sienna accents, muted earth tones
- **Motion**: Gentle staggered reveals, organic easing, purposeful transitions
- **Signature Element**: Luminous weeks counter with amber glow

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Supabase account with a project created
- Supabase project URL and anon key

### Installation

1. **Clone or navigate to the project directory**

```bash
cd 4000-weeks-app
```

2. **Install dependencies** (if not already done)

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up Supabase database**

- Go to your Supabase project dashboard
- Navigate to SQL Editor
- Copy the contents of `supabase-schema.sql`
- Paste and run it in the SQL Editor

This will create:
- All necessary tables (profiles, projects, tasks, annual_goals, reflections)
- Row Level Security (RLS) policies
- Database triggers for auto-creating user profiles
- Indexes for optimal performance

5. **Start the development server**

```bash
npm run dev
```

6. **Open the app**

Navigate to `http://localhost:5173` in your browser.

## 📁 Project Structure

```
src/
├── features/          # Feature-based modules
│   ├── auth/         # Authentication & user management
│   ├── weeks/        # Weeks counter logic
│   ├── projects/     # Project management with 3+1 constraint
│   ├── tasks/        # Task management & scheduling
│   ├── goals/        # Annual goals
│   └── reflection/   # Weekly reflection
├── lib/              # Shared utilities
│   ├── supabase.ts  # Supabase client
│   └── types.ts     # TypeScript types
├── layouts/          # Page layouts
│   └── MainLayout.tsx
├── pages/            # Main views
│   ├── WeeklyPlanningView.tsx
│   ├── GoalsProjectsView.tsx
│   ├── DailyFocusView.tsx
│   └── ReflectionView.tsx
├── components/       # Reusable UI components
│   └── ui/
└── App.tsx          # Root component with routing
```

## 🎯 Core User Flows

### First-Time User

1. Sign up with email/password
2. Enter birth date (for weeks calculation)
3. (Optional) View welcome tour explaining 3+1 philosophy
4. Life Ops project is auto-created
5. Start adding annual goals and projects

### Daily Workflow

1. Land on **Weekly Planning View** (main workspace)
2. Review 3 active projects + Life Ops in left panel
3. Add tasks to projects
4. Drag tasks to calendar days in center panel
5. See today's focus in right panel
6. Switch to **Daily Focus View** for distraction-free execution
7. Complete tasks one by one

### Weekly Planning

1. Navigate to **Goals & Projects** view
2. Review annual goals
3. Assess active projects
4. Decide what to focus on this week
5. Park projects that aren't current priorities
6. Activate new project from parking lot if needed
7. Return to Weekly Planning to schedule tasks

### Reflection

1. Navigate to **Reflect** view at week's end
2. Review time spent by project
3. Answer reflection prompts:
   - "Was this aligned with your goals?"
   - "What moved the needle?"
   - "What did you choose NOT to do?"
4. Save reflection for future reference

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Custom Design System
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query)
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Icons**: Lucide React
- **Date Utilities**: date-fns

## 🎨 Design System

### Colors

- **Neutrals**: Warm grays and creams (no cold blues or harsh blacks)
- **Primary Accent**: Burnt sienna (#C97755)
- **Secondary Accent**: Amber gold (#C9A36D)
- **Project Colors**: Sage, slate, rust, plum, teal, amber

### Typography

- **Display**: Crimson Pro (3.5rem, serif)
- **Headings**: Crimson Pro (serif)
- **Body**: Inter (sans-serif)
- **Code**: JetBrains Mono (monospace)

### Components

All components follow a consistent design language:
- **Buttons**: 8px border radius, soft shadows, smooth transitions
- **Cards**: 12px border radius, warm borders, subtle paper grain
- **Inputs**: Focused states with amber ring
- **Badges**: Rounded pills with project colors

## 📝 Database Schema

### Tables

- **profiles**: User data + birth date for weeks counter
- **annual_goals**: Yearly objectives linked to projects
- **projects**: User projects with status (active/parked/completed/abandoned)
- **tasks**: Actionable items belonging to projects
- **reflections**: Weekly review data

### Key Constraints

- Maximum 3 active non-Life-Ops projects (enforced at app level)
- Tasks must have a project_id (no orphan tasks)
- Row Level Security (RLS) ensures users only see their own data

## 🚧 Phase 2 Features (Planned)

- Google Calendar bidirectional sync
- Recurring tasks with habit tracking
- Guided weekly planning ritual flow
- Advanced analytics & project health dashboard
- Full Pomodoro timer in Daily Focus
- Mobile-optimized responsive polish
- Real-time collaboration features

## 📚 Resources

- [Product Specification](../Reference/4000weeks-product-spec.docx.md)
- [Design Document](../docs/plans/2026-01-08-4000weeks-design.md)
- [Implementation Plan](../docs/plans/4000weeks-implementation-plan.md)

## 🤝 Philosophy

> "The average human lifespan is absurdly, insultingly brief." — Oliver Burkeman

This app transforms productivity from "getting everything done" to "choosing wisely what to spend your finite time on." Constraints enable focus. The 3-project limit isn't a restriction—it's an invitation to prioritize what truly matters.

## 📄 License

Private project - All rights reserved

---

**Built with** ❤️ **and intentionality**
