-- supabase/migrations/20240725000000_initial_schema.sql

-- Create a custom type for user roles to ensure data integrity.
CREATE TYPE public.user_role AS ENUM ('admin', 'assistant', 'client');

-------------------------------------------
-- TABLES
-------------------------------------------

-- PROFILES TABLE
-- Stores public-facing profile data for each user.
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  email text,
  role user_role NOT NULL DEFAULT 'client'::user_role,
  active boolean NOT NULL DEFAULT true,
  must_change_password boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);
COMMENT ON TABLE public.profiles IS 'Stores public profile data for each user, linked to auth.users.';

-- CLIENTS TABLE
-- Stores specific information about the doula's clients.
CREATE TABLE public.clients (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  full_name text NOT NULL,
  dpp date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (user_id) -- A user can only be a client once.
);
COMMENT ON TABLE public.clients IS 'Stores specific information about the doula''s clients (pregnant women).';


-------------------------------------------
-- TRIGGERS & FUNCTIONS
-------------------------------------------

-- Set up a function and trigger for auto-updating `updated_at` timestamps.
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER on_clients_updated
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();


-- This function and trigger automatically create a profile for new users.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, must_change_password)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    -- Default to 'client', but allow override from metadata for admin/assistant creation.
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'client'::public.user_role),
    -- Set must_change_password to true only for clients created programmatically by an admin.
    (COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'client'::public.user_role) = 'client'::public.user_role)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger that fires the function upon new user creation.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();


-------------------------------------------
-- RLS (ROW LEVEL SECURITY)
-------------------------------------------

-- Enable RLS on all relevant tables.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Helper function to get the role of the currently authenticated user.
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.user_role AS $$
BEGIN
  -- Use a non-throwing query to handle cases where the profile might not exist yet
  -- during the transaction.
  RETURN (SELECT role FROM public.profiles WHERE id = auth.uid());
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- PROFILES POLICIES
CREATE POLICY "Allow users to see their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Allow admins and assistants to see all profiles"
  ON public.profiles FOR SELECT
  USING (public.get_my_role() IN ('admin', 'assistant'));
  
CREATE POLICY "Allow users to update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow admins to update any profile"
  ON public.profiles FOR UPDATE
  USING (public.get_my_role() = 'admin');


-- CLIENTS POLICIES
CREATE POLICY "Allow clients to see their own data"
  ON public.clients FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Allow admins and assistants to see all client data"
  ON public.clients FOR SELECT
  USING (public.get_my_role() IN ('admin', 'assistant'));

CREATE POLICY "Allow admins and assistants to create clients"
  ON public.clients FOR INSERT
  WITH CHECK (public.get_my_role() IN ('admin', 'assistant'));
  
CREATE POLICY "Allow admins and assistants to update clients"
  ON public.clients FOR UPDATE
  USING (public.get_my_role() IN ('admin', 'assistant'));

CREATE POLICY "Allow admins to delete clients"
  ON public.clients FOR DELETE
  USING (public.get_my_role() = 'admin');

-- Default DENY policies are implicit when RLS is enabled.
-- All access must be granted explicitly via the policies above.
