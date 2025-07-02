'use server'

import { createClient } from "@/lib/supabase/server";

export async function getRideDetails(): Promise<any> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('rides')
        .select('*')
        .single();
    
    if (error) {
        console.error("Error fetching ride details:", error);
        return null;
    }

    return data;
}