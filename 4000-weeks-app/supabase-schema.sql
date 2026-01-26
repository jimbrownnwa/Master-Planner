-- 4000 Weeks Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  birth_date date,
  created_at timestamptz default now() not null,
  settings jsonb default '{}'::jsonb
);

-- Annual Goals table
create table public.annual_goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  year integer not null,
  status text check (status in ('active', 'completed', 'abandoned')) default 'active',
  created_at timestamptz default now() not null,
  completed_at timestamptz
);

-- Projects table
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  goal_id uuid references public.annual_goals(id) on delete set null,
  title text not null,
  description text,
  status text check (status in ('active', 'parked', 'completed', 'abandoned')) default 'active',
  is_life_ops boolean default false,
  position integer not null default 0,
  color text default 'sage',
  created_at timestamptz default now() not null,
  archived_at timestamptz,
  completion_notes text
);

-- Tasks table
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  estimated_minutes integer,
  status text check (status in ('pending', 'in_progress', 'completed', 'skipped')) default 'pending',
  scheduled_date date,
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now() not null
);

-- Reflections table
create table public.reflections (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  week_start date not null,
  week_summary text,
  alignment_reflection text,
  what_moved_needle text,
  conscious_choices text,
  created_at timestamptz default now() not null,
  unique(user_id, week_start)
);

-- Indexes for better query performance
create index profiles_id_idx on public.profiles(id);
create index annual_goals_user_id_idx on public.annual_goals(user_id);
create index annual_goals_year_idx on public.annual_goals(year);
create index projects_user_id_idx on public.projects(user_id);
create index projects_status_idx on public.projects(status);
create index tasks_project_id_idx on public.tasks(project_id);
create index tasks_scheduled_date_idx on public.tasks(scheduled_date);
create index tasks_scheduled_start_idx on public.tasks(scheduled_start);
create index reflections_user_id_idx on public.reflections(user_id);
create index reflections_week_start_idx on public.reflections(week_start);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.annual_goals enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.reflections enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Annual goals policies
create policy "Users can view own goals"
  on public.annual_goals for select
  using (auth.uid() = user_id);

create policy "Users can create own goals"
  on public.annual_goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update own goals"
  on public.annual_goals for update
  using (auth.uid() = user_id);

create policy "Users can delete own goals"
  on public.annual_goals for delete
  using (auth.uid() = user_id);

-- Projects policies
create policy "Users can view own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can create own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

-- Tasks policies
create policy "Users can view own tasks"
  on public.tasks for select
  using (
    exists (
      select 1 from public.projects
      where projects.id = tasks.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can create own tasks"
  on public.tasks for insert
  with check (
    exists (
      select 1 from public.projects
      where projects.id = tasks.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can update own tasks"
  on public.tasks for update
  using (
    exists (
      select 1 from public.projects
      where projects.id = tasks.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can delete own tasks"
  on public.tasks for delete
  using (
    exists (
      select 1 from public.projects
      where projects.id = tasks.project_id
      and projects.user_id = auth.uid()
    )
  );

-- Reflections policies
create policy "Users can view own reflections"
  on public.reflections for select
  using (auth.uid() = user_id);

create policy "Users can create own reflections"
  on public.reflections for insert
  with check (auth.uid() = user_id);

create policy "Users can update own reflections"
  on public.reflections for update
  using (auth.uid() = user_id);

create policy "Users can delete own reflections"
  on public.reflections for delete
  using (auth.uid() = user_id);

-- Function to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);

  -- Create Life Ops project for new user
  insert into public.projects (user_id, title, description, status, is_life_ops, position)
  values (new.id, 'Life Ops', 'Health, home, relationships, and daily maintenance', 'active', true, 4);

  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
