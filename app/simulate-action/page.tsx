'use client';

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { startRide, endRide } from "@/utils/updateRideData"; // Adjust path as needed

export default function SimulateActionClient() {
  const [isRideActive, setIsRideActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartRide = async () => {
    setIsLoading(true);
    try {
      const result = await startRide();
      if (result.success) {
        setIsRideActive(true);
      } else {
        console.error("Failed to start ride:", result.error);
        // You could show an error message to the user here
      }
    } catch (error) {
      console.error("Error starting ride:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndRide = async () => {
    setIsLoading(true);
    try {
      const result = await endRide();
      if (result.success) {
        setIsRideActive(false);
      } else {
        console.error("Failed to end ride:", result.error);
        // You could show an error message to the user here
      }
    } catch (error) {
      console.error("Error ending ride:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full justify-center items-center">
      <div className="flex flex-col gap-4 items-center">
        <h2 className="font-bold text-2xl mb-4">Simulate Ride Action</h2>
        
        {isRideActive && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
            <p className="text-blue-700 font-medium">🚗 User on ride...</p>
          </div>
        )}
        
        <div className="flex flex-col gap-2 items-center">
          <Button 
            onClick={handleStartRide}
            disabled={isRideActive || isLoading}
          >
            {isLoading ? "Processing..." : "Start Ride"}
          </Button>
          <Button 
            className="bg-red-400 hover:bg-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed" 
            onClick={handleEndRide}
            disabled={!isRideActive || isLoading}
          >
            {isLoading ? "Processing..." : "End Ride"}
          </Button>
        </div>
      </div>
    </div>
  );
}