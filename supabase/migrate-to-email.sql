    -- Run this ONCE if you already ran the first version of schema.sql
    -- (the one with an "employee_id" column). It switches profiles to email.

    alter table public.profiles rename column employee_id to email;

    -- fill in each profile's real login email
    update public.profiles p
    set email = u.email
    from auth.users u
    where u.id = p.id;
