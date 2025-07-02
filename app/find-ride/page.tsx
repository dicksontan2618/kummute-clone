'use client';

import { getRideDetails } from "@/utils/getRideData";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function FindRideClient() {
    const [seatCount, setSeatCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient(); // Client-side supabase instance
        
        const fetchInitialData = async () => {
            const count = await getRideDetails();
            console.log("Initial Data : ", JSON.stringify(count, null, 2));
            setSeatCount(count?.seats_left || 0);
            setIsLoading(false);
        };

        // Subscribe to realtime changes
        const channel = supabase
            .channel('rides-changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'rides'
                },
                (payload) => {
                    console.log('Realtime update received:', payload);
                    // Update seat count when seats_left changes
                    if (payload.new && payload.new.seats_left !== undefined) {
                        setSeatCount(payload.new.seats_left);
                    }
                }
            )
            .subscribe();

        // Fetch initial data
        fetchInitialData();

        // Cleanup subscription on unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-full justify-center items-center">
                <div className="flex flex-col gap-2 items-center">
                    <h2 className="font-bold text-2xl mb-4">Seat Availability</h2>
                    <p className="text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full justify-center items-center">
            <div className="flex flex-col gap-2 items-center">
                <h2 className="font-bold text-2xl mb-4">Seat Availability</h2>
                <div className="flex flex-col gap-2 items-center">
                    <p className="text-lg">Available Seats: {seatCount}</p>
                    <div className="text-sm text-gray-500">
                        🟢 Real-time updates enabled
                    </div>
                </div>
            </div>
        </div>
    );
}