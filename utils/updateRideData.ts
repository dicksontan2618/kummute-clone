'use server'

import { createClient } from "@/lib/supabase/server";

export async function startRide(): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient();
        
        // First get the current seats_left value for ride ID 1
        const { data: currentData, error: fetchError } = await supabase
            .from('rides')
            .select('seats_left')
            .eq('id', 1)
            .single();
            
        if (fetchError) {
            return { success: false, error: "Failed to fetch current ride data" };
        }
        
        // Decrement seats_left by 1 (but don't go below 0) - taking a seat
        const newSeatsLeft = Math.max(0, currentData.seats_left - 1);
        
        const { error: updateError } = await supabase
            .from('rides')
            .update({ seats_left: newSeatsLeft })
            .eq('id', 1)
            .single();
        
        if (updateError) {
            return { success: false, error: "Failed to start ride" };
        }
        
        return { success: true };
        
    } catch (error) {
        return { success: false, error: "Unexpected error occurred" };
    }
}

export async function endRide(): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient();
        
        // First get the current seats_left value for ride ID 1
        const { data: currentData, error: fetchError } = await supabase
            .from('rides')
            .select('seats_left')
            .eq('id', 1)
            .single();
            
        if (fetchError) {
            return { success: false, error: "Failed to fetch current ride data" };
        }
        
        // Increment seats_left by 1 - freeing up a seat
        const newSeatsLeft = currentData.seats_left + 1;
        
        const { error: updateError } = await supabase
            .from('rides')
            .update({ seats_left: newSeatsLeft })
            .eq('id', 1)
            .single();
        
        if (updateError) {
            return { success: false, error: "Failed to end ride" };
        }
        
        return { success: true };
        
    } catch (error) {
        return { success: false, error: "Unexpected error occurred" };
    }
}