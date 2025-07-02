import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    'https://hvytehhazzipzhtxywwl.supabase.co'!,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2eXRlaGhhenppcHpodHh5d3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNzEyMzcsImV4cCI6MjA2Njg0NzIzN30.TnSStyljzemVp_AotR6-S5tYsz2nE76esMaHsWQPuWo'!,
  );
}
