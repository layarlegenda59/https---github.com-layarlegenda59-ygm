
-- Create debtors table
CREATE TABLE public.debtors (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    name text NOT NULL,
    phone text NOT NULL,
    email text,
    "totalDebt" real NOT NULL DEFAULT '0'::double precision,
    "dueDate" date NOT NULL,
    "funderDueDate" date NOT NULL,
    status text NOT NULL,
    "leasingBpkb" text,
    funder text,
    user_id uuid NULL default auth.uid(),
    CONSTRAINT debtors_pkey PRIMARY KEY (id),
    CONSTRAINT debtors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);
ALTER TABLE public.debtors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to access their own data" ON public.debtors FOR ALL TO authenticated USING (auth.uid() = user_id);


-- Create notification_logs table
CREATE TABLE public.notification_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    "debtorName" text,
    type text,
    channel text,
    "sentAt" timestamp with time zone NULL DEFAULT now(),
    status text,
    user_id uuid NULL default auth.uid(),
    CONSTRAINT notification_logs_pkey PRIMARY KEY (id),
    CONSTRAINT notification_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to access their own logs" ON public.notification_logs FOR ALL TO authenticated USING (auth.uid() = user_id);


-- Set up storage
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);
CREATE POLICY "Avatar images are publicly accessible." ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Anyone can upload an avatar." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
