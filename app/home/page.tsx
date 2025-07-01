import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/");
  }

  return (
    <div className="flex h-full justify-center items-center">
      <div className="flex flex-col gap-2 items-center">
        <h2 className="font-bold text-2xl mb-4">Kummute Home Page</h2>
        <div className="flex flex-col gap-2 items-center">
          <Button>Real Time Feature 1</Button>
          <Button>Real Time Feature 2</Button>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
