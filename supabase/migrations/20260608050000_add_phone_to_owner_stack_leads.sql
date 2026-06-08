alter table public.owner_stack_leads
  add column if not exists phone text;

comment on column public.owner_stack_leads.phone is
  'Best phone number for text or call follow-up.';
