# Knoted Co. Supabase Setup

1. Create a Supabase project.
2. Open **SQL Editor** and run `supabase/schema.sql`.
3. Add these env vars locally and on Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=knoted-co
```

4. Seed the storage bucket and product catalogue (creates the public `knoted-co`
   bucket automatically, uploads the images in `public/products/`, and inserts
   the matching product rows):

```bash
npm run seed:catalog
```
