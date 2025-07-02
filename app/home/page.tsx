'use client';
import { useRouter } from "next/navigation";
import Image from "next/image";
import car from "@/public/book-car.png";
import kumpool from "@/public/kumpool.png";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePageClient() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="h-full">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center p-3">
          <h2 className="font-bold">Home Apps</h2>
          <h2 className="font-bold text-red-400" onClick={logout}>Logout</h2>
        </div>
        <div className="flex gap-8 pl-3 items-center">
          <div className="flex flex-col gap-3 items-center" onClick={() => router.push("/decision")}>
            <Image src={car} alt="Car" width={25} height={25}/>
            <p className="text-xs text-gray-600 font-semibold">Book a ride</p>
          </div>
          <div className="flex flex-col gap-3 items-center">
            <Image src={kumpool} alt="Car" width={25} height={25}/>
            <p className="text-xs text-gray-600 font-semibold">Kumpool</p>
          </div>
          <div className="flex flex-col gap-3 items-center">
            <Image src={kumpool} alt="Car" width={25} height={25}/>
            <p className="text-xs text-gray-600 font-semibold">Kumride</p>
          </div>
        </div>
        <div className="mt-4 bg-[#f2f2f2] pb-4">
          <div className="flex justify-between items-center p-3">
            <h2 className="font-bold">Shortcuts</h2>
            <h2 className="font-bold text-[#3cccca]">Customize</h2>
          </div>
          <div className="flex gap-2 p-3">
            <Card className="w-1/2">
              <CardHeader>
                <CardTitle>Book a Ride</CardTitle>
                <CardDescription>Quickly book a ride</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Click to book a ride now!</p>
              </CardContent>
            </Card>
            <Card className="w-1/2">
              <CardHeader>
                <CardTitle>Kumpool</CardTitle>
                <CardDescription>Join a pool</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Join a pool with others.</p>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex justify-between items-center p-3">
          <h2 className="font-bold">Kummute Token</h2>
          <h2 className=" text-gray-600 text-sm underline">Kummute Ride</h2>
        </div>
        <div className="px-3">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="font-medium text-sm">Your Total $KUM Balance</CardTitle>
              <CardDescription className="font-semibold text-2xl">0.0000</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <div className="px-3">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="font-medium text-sm">$KUM Price</CardTitle>
              <CardDescription className="font-semibold text-2xl">RM 85.48</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <div className="px-3 flex justify-center">
          <Button className="w-3/4 bg-[#026ca8] mt-2">Go to Rewards</Button>
        </div>
        <div className="mt-4 bg-[#f2f2f2] pb-4">
          <div className="flex justify-between items-center p-3">
            <h2 className="font-bold">Ads</h2>
          </div>
          <div className="flex gap-2 p-3">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="font-medium text-sm">Ad Title</CardTitle>
                <CardDescription className="text-xs text-gray-600">This is a sample ad description.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Click here to learn more about this ad.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
