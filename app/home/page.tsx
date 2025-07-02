'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button";

export default function HomePageClient() {
  const router = useRouter();

  return (
    <div className="flex h-full justify-center items-center">
      <div className="flex flex-col gap-2 items-center">
        <h2 className="font-bold text-2xl mb-4">Kummute Home Page</h2>
        <div className="flex flex-col gap-2 items-center">
          <Button onClick={() => router.push("/find-ride")}>Find Ride</Button>
          <Button onClick={() => router.push("/simulate-action")}>Simulate Action</Button>
          <Link href='/decision'>
            <Button>Real Time Feature 2</Button>
          </Link>
          
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
