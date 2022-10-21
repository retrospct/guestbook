export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://qjultqiqhxydgshgzslp.supabase.co',
    secret: process.env.SUPABASE_SECRET_KEY!,
    public_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  }
}
