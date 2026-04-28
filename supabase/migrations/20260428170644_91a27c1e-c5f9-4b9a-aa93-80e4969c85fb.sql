-- =========================================================
-- ROLES (separate table to prevent privilege escalation)
-- =========================================================
create type public.app_role as enum ('admin', 'member');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- =========================================================
-- PROFILES
-- =========================================================
create type public.account_status as enum ('Active', 'Suspended');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null default '',
  status account_status not null default 'Active',
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  insert into public.user_roles (user_id, role) values (new.id, 'member');
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Profile RLS
create policy "Users read own profile" on public.profiles
  for select to authenticated using (auth.uid() = id);
create policy "Admins read all profiles" on public.profiles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Users update own profile (limited)" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "Admins update any profile" on public.profiles
  for update to authenticated using (public.has_role(auth.uid(), 'admin'));

-- user_roles RLS
create policy "Users read own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);
create policy "Admins read all roles" on public.user_roles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage roles" on public.user_roles
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- CHAPTERS
-- =========================================================
create type public.visibility as enum ('public', 'archived');

create table public.chapters (
  id text primary key,
  era text,
  era_dates text,
  title text not null,
  subtitle text,
  pull_quote text,
  hero jsonb,
  gallery jsonb default '[]'::jsonb,
  intro jsonb default '[]'::jsonb,
  timeline jsonb default '[]'::jsonb,
  widgets jsonb default '[]'::jsonb,
  key_points jsonb default '[]'::jsonb,
  daleel_insight text,
  layout text default 'primary',
  visibility public.visibility not null default 'public',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.chapters enable row level security;
create trigger chapters_updated_at before update on public.chapters
  for each row execute function public.set_updated_at();

create policy "Public chapters visible to all signed-in users" on public.chapters
  for select to authenticated using (visibility = 'public');
create policy "Admins see all chapters" on public.chapters
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage chapters" on public.chapters
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- QUIZZES + QUESTIONS
-- =========================================================
create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  reward_points int not null default 100,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.quizzes enable row level security;

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question_text text not null,
  choices jsonb not null,
  correct_answer int not null,
  rationale text,
  hint text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.questions enable row level security;

create policy "Signed in users read published quizzes" on public.quizzes
  for select to authenticated using (is_published = true);
create policy "Admins manage quizzes" on public.quizzes
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Signed in users read questions of published quizzes" on public.questions
  for select to authenticated using (
    exists (select 1 from public.quizzes q where q.id = quiz_id and q.is_published = true)
  );
create policy "Admins manage questions" on public.questions
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- ACHIEVEMENTS
-- =========================================================
create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text,
  icon text,
  points int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.achievements enable row level security;

create table public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);
alter table public.user_achievements enable row level security;

create policy "Anyone signed in reads achievements" on public.achievements
  for select to authenticated using (true);
create policy "Admins manage achievements" on public.achievements
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Users read own unlocked badges" on public.user_achievements
  for select to authenticated using (auth.uid() = user_id);
create policy "Admins read all unlocked badges" on public.user_achievements
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Users insert own unlocked badges" on public.user_achievements
  for insert to authenticated with check (auth.uid() = user_id);

-- =========================================================
-- SUBMISSIONS
-- =========================================================
create type public.submission_status as enum ('pending', 'approved', 'rejected');

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  media_url text,
  category text,
  status public.submission_status not null default 'pending',
  reviewer_notes text,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.submissions enable row level security;
create trigger submissions_updated_at before update on public.submissions
  for each row execute function public.set_updated_at();

create policy "Users read own submissions" on public.submissions
  for select to authenticated using (auth.uid() = user_id);
create policy "Anyone signed in reads approved submissions" on public.submissions
  for select to authenticated using (status = 'approved');
create policy "Admins read all submissions" on public.submissions
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Users create own submissions" on public.submissions
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users update own pending submissions" on public.submissions
  for update to authenticated
  using (auth.uid() = user_id and status = 'pending')
  with check (auth.uid() = user_id);
create policy "Admins moderate submissions" on public.submissions
  for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- REALTIME
-- =========================================================
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.chapters;
alter publication supabase_realtime add table public.submissions;