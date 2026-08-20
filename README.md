# MRPurna Frontend

## Netlify deployment

This is a Next.js App Router application. Netlify should use the repository root as the base directory; the root `netlify.toml` points the build to `frontend` and keeps Server Actions enabled.

1. Push the repository to GitHub and import it into Netlify.
2. Keep the detected base directory as `frontend` (the included `netlify.toml` already configures this).
3. Add these environment variables in Netlify Site configuration:

```text
NEXT_PUBLIC_SUPABASE_URL=https://eknplqovxnfupyfonzsd.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
NEXT_PUBLIC_API_URL=https://your-deployed-backend.example.com/api
```

`NEXT_PUBLIC_API_URL` must point to a publicly deployed Express backend. Do not use `localhost` in Netlify. The Supabase integration at `/supabase-demo` uses the publishable key and RLS policies from `schema.sql`; never add the direct PostgreSQL connection string or a service-role key to frontend or Netlify public variables.

After deploying, run `schema.sql` in the Supabase SQL Editor and open `/supabase-demo` on the Netlify domain.