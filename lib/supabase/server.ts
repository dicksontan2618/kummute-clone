import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    'https://hvytehhazzipzhtxywwl.supabase.co'!,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2eXRlaGhhenppcHpodHh5d3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNzEyMzcsImV4cCI6MjA2Njg0NzIzN30.TnSStyljzemVp_AotR6-S5tYsz2nE76esMaHsWQPuWo'!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
