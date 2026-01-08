

**4000 Weeks**  
Focus & Intentionality System

Product Requirements Specification

Version 1.0 | January 2026

| *"The average human lifespan is absurdly, insultingly brief."* — Oliver Burkeman, Four Thousand Weeks |
| :---: |

# **Executive Summary**

4000 Weeks is a strategic focus management application designed to help knowledge workers maintain intentional alignment between their daily activities and long-term goals. Unlike traditional task managers that encourage endless accumulation of to-dos, this application enforces constraints that reflect the finite nature of human time and attention.

The application is inspired by Oliver Burkeman's book "Four Thousand Weeks," which observes that the average human lifespan comprises roughly 4,000 weeks. This framing transforms productivity from "getting everything done" to "choosing wisely what to spend your finite time on."

## **Core Philosophy**

* Time is finite and non-renewable. Every task is a choice about how to spend irreplaceable hours.

* Constraints enable focus. Limiting active projects to three (plus Life Ops) forces prioritization.

* Alignment creates meaning. All work should connect to goals that matter.

* Reflection builds wisdom. Tracking what moves the needle improves future decisions.

# **Information Architecture**

The application uses a hierarchical goal structure that flows from long-term vision down to daily tasks:

| 5+ Year Vision | Aspirational long-term direction. Freeform text capturing where you want your life to be. |
| :---- | :---- |
| **Annual Goals** | Specific, measurable objectives for the current year. Each should connect to the broader vision. |
| **Active Projects (3 max)** | Current initiatives that advance annual goals. Strict limit enforces focus. |
| **Life Ops (permanent)** | Fourth project slot for maintenance activities: health, home, relationships, admin. |
| **Parking Lot** | Projects committed to but not actively working. Must swap with active to resume. |
| **Tasks** | Actionable items belonging to a project. Cannot exist without project assignment. |
| **Time Blocks** | Scheduled calendar slots allocated to specific tasks or project work. |

# **Data Model**

### **Users**

| Field | Type | Description |
| :---- | :---- | :---- |
| id | uuid | Primary key |
| email | string | User email address |
| birth\_date | date | Used to calculate weeks remaining |
| created\_at | timestamp | Account creation date |
| settings | jsonb | User preferences and configuration |

### **Vision**

| Field | Type | Description |
| :---- | :---- | :---- |
| id | uuid | Primary key |
| user\_id | uuid | Foreign key to users |
| content | text | Freeform vision description |
| updated\_at | timestamp | Last modification date |

### **Annual Goals**

| Field | Type | Description |
| :---- | :---- | :---- |
| id | uuid | Primary key |
| user\_id | uuid | Foreign key to users |
| title | string | Goal title |
| description | text | Detailed goal description |
| year | integer | Target year (e.g., 2026\) |
| status | enum | active, completed, abandoned |
| created\_at | timestamp | Creation date |
| completed\_at | timestamp | Completion date (nullable) |

### **Projects**

| Field | Type | Description |
| :---- | :---- | :---- |
| id | uuid | Primary key |
| user\_id | uuid | Foreign key to users |
| goal\_id | uuid | Foreign key to annual\_goals (nullable for Life Ops) |
| title | string | Project name |
| description | text | Project description and notes |
| status | enum | active, parked, completed, abandoned |
| is\_life\_ops | boolean | True for the permanent Life Ops project |
| position | integer | Display order (1-4 for active projects) |
| created\_at | timestamp | Creation date |
| archived\_at | timestamp | Archive date (nullable) |
| completion\_notes | text | Reflection on what worked/learned |

### **Tasks**

| Field | Type | Description |
| :---- | :---- | :---- |
| id | uuid | Primary key |
| project\_id | uuid | Foreign key to projects (required) |
| title | string | Task description |
| estimated\_minutes | integer | Time estimate for planning |
| status | enum | pending, in\_progress, completed, skipped |
| scheduled\_date | date | Target date (nullable) |
| completed\_at | timestamp | Completion timestamp (nullable) |
| is\_recurring | boolean | True for habit-based recurring tasks |
| recurrence\_rule | string | iCal RRULE format (nullable) |
| parent\_task\_id | uuid | For recurring task instances |

### **Time Blocks**

| Field | Type | Description |
| :---- | :---- | :---- |
| id | uuid | Primary key |
| user\_id | uuid | Foreign key to users |
| task\_id | uuid | Foreign key to tasks (nullable) |
| project\_id | uuid | Foreign key to projects (for unstructured work) |
| date | date | Block date |
| start\_time | time | Block start time |
| duration\_minutes | integer | Planned duration |
| actual\_minutes | integer | Actual time spent (nullable) |
| google\_event\_id | string | Synced calendar event ID (nullable) |
| notes | text | Session notes or reflection |

# **Core Features**

## **Weeks Counter**

| Persistent Life Awareness A subtle but ever-present display showing the user's current week number out of approximately 4,000. Based on birth date, this counter appears in the header of every view. Example: "Week 2,347 of \~4,000". The goal is not morbidity but clarity—every planning session happens in the context of finite time. |
| :---- |

## **Weekly Planning Ritual**

| Guided Weekly Setup A structured flow (suggested Sunday evening) that walks users through: reviewing their three active projects, checking alignment with annual goals, acknowledging what they chose NOT to do last week, and pre-allocating time blocks for the upcoming week. This ritual reinforces intentionality. |
| :---- |

## **Project Constraints**

| Enforced Focus Limits Users can have at most three active projects plus the permanent Life Ops project. To activate a parked project, an active project must first be completed, parked, or abandoned. This constraint is firm but not punitive—the UI makes the trade-off explicit and easy to execute. |
| :---- |

## **Task Alignment Enforcement**

| No Orphan Tasks Every task must belong to a project. When creating a task, users must select which of their four active projects (including Life Ops) it serves. If they try to add something that doesn't fit, the system prompts: "This doesn't seem to fit your current projects. Would you like to add it to the parking lot as a future project?" |
| :---- |

## **Time Blocking Interface**

| Visual Time Allocation Similar to Ellie Planner's timebox panel, users can drag tasks into time slots on their calendar. The interface shows available hours, already-committed time, and helps users see when they're over-allocating. Integration with Google Calendar syncs these blocks bidirectionally. |
| :---- |

## **Recurring Tasks as Habits**

| Daily Choice Architecture Recurring tasks (Morning Routine, Exercise, etc.) auto-generate as available items each day but don't auto-schedule. Users must consciously allocate time to them, reinforcing the "every day is a choice" philosophy. Streaks can be tracked but missing a day doesn't create guilt-inducing red badges. |
| :---- |

## **Project Completion Flow**

| Reflection and Learning When completing or archiving a project, users are prompted to: capture what was accomplished, note what moved the needle toward the linked annual goal, record what they learned, and choose their next focus from the parking lot. This data accumulates into strategic learning over time. |
| :---- |

## **Daily Focus View**

| Distraction-Free Execution A minimal view showing only today's time blocks, current task, and which project it serves. No backlog, no parking lot, no goals—just what you've committed to for this day. Optional focus timer with gentle progress indication. |
| :---- |

# **User Interface Screens**

## **1\. Weekly Planning View (Primary)**

The main workspace, displayed after login. Layout inspired by Ellie Planner:

* Left Panel: Active projects (3 \+ Life Ops) with task lists for each

* Center: Calendar week view with draggable time blocks

* Right Panel: Timebox view showing today's schedule by hour

* Header: Weeks counter, quick-add task, navigation to other views

## **2\. Goals & Projects View**

Strategic overview and project management:

* Vision statement (editable freeform text)

* Annual goals as cards with linked projects shown

* Three active project slots with clear visual hierarchy

* Parking lot as a collapsible section below

* Project health indicators (days since activity, completion percentage)

## **3\. Daily Focus View**

Minimal execution interface:

* Current time block highlighted

* Next three scheduled items visible

* Project context shown for current task

* Optional Pomodoro-style timer

* Quick complete/skip/defer actions

## **4\. Reflection View**

Weekly and on-demand review:

* Week summary: hours allocated vs. actual by project

* Completed tasks and their project distribution

* Conscious choices: what you decided NOT to do

* Prompt: "You spent week N on... Was this aligned with your goals?"

* Historical view of past weeks' reflections

# **Technical Architecture**

## **Technology Stack**

| Layer | Technology |
| :---- | :---- |
| **Frontend** | React with TypeScript, Tailwind CSS, React Query |
| **Backend** | Supabase (PostgreSQL, Auth, Realtime) |
| **Calendar Sync** | Google Calendar API (OAuth 2.0) |
| **Hosting** | Vercel (frontend), Supabase (backend) |
| **Future Automation** | n8n for workflow integrations |

## **Google Calendar Integration**

The application syncs time blocks bidirectionally with Google Calendar:

* OAuth 2.0 flow for calendar access authorization

* Time blocks created in-app push to Google Calendar as events

* Events created in Google Calendar can be pulled as time blocks

* Conflict detection when external events overlap planned blocks

* Calendar selector for users with multiple Google calendars

## **Responsive Design**

Desktop-first design with responsive breakpoints:

* Desktop (1200px+): Full three-panel layout

* Tablet (768-1199px): Collapsible side panels, swipeable views

* Mobile (\< 768px): Single-panel with bottom navigation

# **MVP Scope**

The minimum viable product focuses on core workflow without advanced features:

## **Included in MVP**

* User authentication (Supabase Auth with email)

* Birth date input and weeks counter display

* Annual goals CRUD

* Project management with 3+1 constraint enforcement

* Parking lot functionality

* Task management with required project assignment

* Basic time blocking (no calendar sync)

* Weekly and daily views

* Simple project completion with notes

## **Post-MVP Features**

* Google Calendar bidirectional sync

* Recurring tasks with habit tracking

* Weekly planning ritual flow

* Reflection view with historical data

* Project health dashboard

* Focus mode with timer

* Microsoft Calendar support

* Mobile app (React Native or PWA)

* n8n automation integrations

# **Appendix: Design Principles**

## **Constraint as Feature**

The three-project limit is not a restriction to work around—it's the core value proposition. The UI should make this feel empowering, not limiting. Every constraint is an invitation to prioritize.

## **Time Language**

Use language that reinforces the 4000 Weeks philosophy. Instead of "you have 40 hours to allocate," say "you're choosing to spend 40 of your remaining hours." Frame tasks as choices, not obligations.

## **No Guilt Design**

Unfinished tasks don't carry forward with shame indicators. Each day is a fresh canvas. The system asks "what do you want to commit to today?" not "here's what you failed to do yesterday."

## **Visible Trade-offs**

When adding tasks or projects, surface opportunity cost. "Adding this means less time for X." Not blocking, just awareness. Help users make informed trade-offs rather than unconscious accumulation.

## **Reflection Over Metrics**

Avoid gamification that turns productivity into a score to optimize. Instead, prompt genuine reflection: "Was this week well-spent?" The goal is wisdom about what matters, not productivity points.