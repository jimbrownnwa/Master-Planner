# Master Planner - 4000 Weeks Focus & Intentionality System

> "The average human lifespan is absurdly, insultingly brief." — Oliver Burkeman

A strategic focus management application that transforms productivity from "getting everything done" to "choosing wisely what to spend your finite time on."

![Phase](https://img.shields.io/badge/Phase-1%20Complete-success)
![Status](https://img.shields.io/badge/Status-Active%20Development-blue)
![License](https://img.shields.io/badge/License-Private-red)

## 🎯 Philosophy

Inspired by Oliver Burkeman's "Four Thousand Weeks," this application enforces intentional alignment between daily activities and long-term goals through meaningful constraints.

**Core Principles:**
- **Time is finite** - Every task is a choice about irreplaceable hours
- **Constraints enable focus** - The 3-project limit forces prioritization
- **Alignment creates meaning** - All work connects to goals that matter
- **Reflection builds wisdom** - Track what moves the needle

## ✨ Key Features

### Phase 1 (Completed)

- ✅ **Luminous Weeks Counter** - Persistent reminder showing Week X of ~4,000
- ✅ **3+1 Project Constraint** - Maximum 3 active projects + permanent Life Ops
- ✅ **No Orphan Tasks** - Every task must belong to a project
- ✅ **Weekly Planning View** - Three-panel workspace (Projects | Calendar | Today's Focus)
- ✅ **Goals & Projects Management** - Strategic overview with visual project slots
- ✅ **Daily Focus Mode** - Minimal distraction-free execution interface
- ✅ **Reflection System** - Weekly review with thoughtful prompts
- ✅ **Full Authentication** - Secure login/signup with Supabase
- ✅ **Birth Date Onboarding** - Automatic weeks calculation

### Phase 2 (Planned)

- ⏸️ Google Calendar bidirectional sync
- ⏸️ Recurring tasks with habit tracking
- ⏸️ Guided weekly planning ritual
- ⏸️ Advanced analytics & project health dashboard
- ⏸️ Full Pomodoro timer integration
- ⏸️ Mobile-optimized responsive polish
- ⏸️ Real-time collaboration features

## 🎨 Design Aesthetic

**Contemplative Modernism** - A warm, journal-like interface that honors the finite nature of time.

- **Typography**: Crimson Pro (editorial serif) + Inter (refined sans)
- **Palette**: Warm creams, burnt sienna accents, muted earth tones
- **Motion**: Gentle staggered reveals with organic easing
- **Texture**: Subtle paper grain overlay for depth
- **Signature**: Luminous amber-glowing weeks counter

The interface evokes a well-crafted journal—serious in purpose, warm in execution, with every element intentionally placed.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Supabase account and project
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/jimbrownnwa/Master-Planner.git
cd Master-Planner/4000-weeks-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials
```

### Supabase Setup

1. Create a Supabase project at https://supabase.com
2. Go to SQL Editor in your Supabase dashboard
3. Copy and run the contents of `supabase-schema.sql`
4. Add your credentials to `.env`:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### Run the Application

```bash
npm run dev
```

Open http://localhost:5173 and create your account!

## 📁 Project Structure

```
Master-Planner/
├── 4000-weeks-app/              # Main React application
│   ├── src/
│   │   ├── features/            # Feature-based modules
│   │   │   ├── auth/           # Authentication & user management
│   │   │   ├── weeks/          # Weeks counter logic
│   │   │   ├── projects/       # Project management with 3+1 constraint
│   │   │   ├── tasks/          # Task management & scheduling
│   │   │   └── ...
│   │   ├── pages/              # Main views (Weekly, Goals, Focus, Reflect)
│   │   ├── layouts/            # App layout components
│   │   ├── components/         # Reusable UI components
│   │   └── lib/                # Utilities, Supabase client, types
│   ├── supabase-schema.sql     # Database setup script
│   └── README.md               # Detailed app documentation
├── docs/
│   └── plans/                  # Design & implementation documentation
├── Reference/                   # Product specs & mockups
└── README.md                   # This file
```

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router v6
- **State**: TanStack Query (React Query)
- **Icons**: Lucide React
- **Date Utilities**: date-fns

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime (Phase 2)

### Deployment
- **Frontend**: Vercel (recommended)
- **Backend**: Supabase Cloud

## 📚 Documentation

- **[Product Specification](Reference/4000weeks-product-spec.docx.md)** - Complete feature requirements
- **[Design Document](docs/plans/2026-01-08-4000weeks-design.md)** - Architecture & design decisions
- **[Implementation Plan](docs/plans/4000weeks-implementation-plan.md)** - Phased development roadmap
- **[App README](4000-weeks-app/README.md)** - Detailed setup & usage guide

## 🎯 Core User Flows

### First-Time User
1. Sign up with email/password
2. Enter birth date (calculates weeks counter)
3. Life Ops project auto-created
4. Add annual goals and projects

### Daily Workflow
1. **Weekly Planning View** - Review projects, add tasks, schedule week
2. **Daily Focus View** - Execute tasks distraction-free
3. Mark tasks complete as you go

### Weekly Planning
1. **Goals & Projects View** - Assess active projects
2. Park projects that aren't priorities
3. Activate new project from parking lot
4. Return to Weekly Planning to schedule

### Reflection
1. **Reflect View** - Review week's time by project
2. Answer prompts about alignment and impact
3. Note conscious trade-offs made
4. Build wisdom over time

## 🔐 Security & Privacy

- Row Level Security (RLS) ensures users only access their own data
- Birth date stored securely, only used for weeks calculation
- Environment variables keep credentials safe
- No tracking or analytics beyond what's needed for features

## 🤝 Contributing

This is a private project, but contributions are welcome!

### Development Workflow
```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes and commit
git add .
git commit -m "Add your feature description"

# Push to GitHub
git push origin feature/your-feature-name
```

## 📝 License

Private project - All rights reserved

## 🙏 Acknowledgments

- **Oliver Burkeman** - For the book "Four Thousand Weeks" that inspired this project
- **Ellie Planner** - For time-blocking UI inspiration
- **Supabase** - For the excellent backend platform

## 📧 Contact

For questions or feedback, please open an issue in this repository.

---

**Built with ❤️ and intentionality**

*Every week counts. Choose wisely.*
