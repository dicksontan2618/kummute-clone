'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { endRide, startRide } from '@/utils/updateRideData';
import { User } from '../chat/[userId]/types';
import { Button } from '@/components/ui/button';

export default function DecisionPage() {
  const supabase = createClient();
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [booked, setBooked] = useState(false); // Track if user has booked
  const [filled, setFilled] = useState(false); // Track if information is confirmed
  
  // New state for seat availability
  const [seatCount, setSeatCount] = useState(0);
  const [isLoadingSeats, setIsLoadingSeats] = useState(true);
  const [isBookingRide, setIsBookingRide] = useState(false); // Track booking process

  // Always use user@gmail.com as driver
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .in('email', ['user@gmail.com', 'user2@gmail.com']);

      if (data && data.length === 2) {
        const driver = data.find((u) => u.email === 'user@gmail.com');
        const passenger = data.find((u) => u.email === 'user2@gmail.com');
        const loggedInUser = await supabase.auth.getUser();
        const me = loggedInUser.data.user;

        if (me?.email === 'user@gmail.com') {
          setSelectedUser(passenger); // if logged in as driver, chat with passenger
        } else {
          setSelectedUser(driver); // if logged in as passenger, chat with driver
        }
      } else {
        console.error('Users not found or incomplete:', error);
      }
    };

    fetchUsers();
  }, []);

  const fetchInitialSeatData = async () => {
    const { data, error } = await supabase
      .from('rides')
      .select('seats_left')
      .eq('id', 1)
      .single();
    
    if (data) {
      setSeatCount(data.seats_left);
    }
    setIsLoadingSeats(false);
  };

  // New useEffect for seat availability with realtime updates
  useEffect(() => {
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
          if (payload.new && payload.new.seats_left !== undefined) {
            setSeatCount(payload.new.seats_left);
          }
        }
      )
      .subscribe();

    // Fetch initial data
    fetchInitialSeatData();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleConfirmInfo = () => {
    setFilled(true);
  };

  const handleBook = async () => {
    setIsBookingRide(true);
    try {
      const result = await startRide();
      if (result.success) {
        setBooked(true);
      } else {
        alert("Failed to book ride. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while booking. Please try again.");
    } finally {
      setIsBookingRide(false);
    }
  };

  const handleEndRide = async () => {
    setIsBookingRide(false);
    try {
      const result = await endRide();
      if (result.success) {
        router.push('/home'); // Redirect to home after ending ride
      } else {
        alert("Failed to end ride. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while ending. Please try again.");
    }
  };

  const handleChat = () => {
    if (selectedUser) {
      router.push(`/chat/${selectedUser.id}`);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Map Placeholder */}
      <div
        style={{
          flex: 1,
          background: '#e0e0e0',
          backgroundImage:
            'url("https://static-maps.yandex.ru/1.x/?lang=en-US&ll=101.6869,3.1390&z=13&size=600,400&l=map")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Bottom Panel */}
      <div style={{ padding: '1rem', background: '#fff', borderTop: '1px solid #ccc' }}>
        {!booked ? (
          <>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              {!filled ? (
                // Show input fields when not filled
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Pick-up:</label>
                    <input
                      type="text"
                      defaultValue="Muzium Negara, Jalan Damansara, 50566 Kuala Lumpur, W.P Kuala Lumpur"
                      style={{
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Drop-off:</label>
                    <input
                      type="text"
                      defaultValue="Jalan Tun Perak, 50050 Kuala Lumpur"
                      style={{
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Payment:</label>
                    <select
                      defaultValue="Kummute Wallet"
                      style={{
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        fontSize: '0.9rem',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="Kummute Wallet">Kummute Wallet</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Cash">Cash</option>
                    </select>
                  </div>
                </>
              ) : (
                // Show confirmed information when filled
                <>
                  <div>
                    <strong>Pick-up:</strong> Muzium Negara, Jalan Damansara, 50566 Kuala Lumpur, W.P Kuala Lumpur
                  </div>
                  <div>
                    <strong>Drop-off:</strong> Jalan Tun Perak, 50050 Kuala Lumpur
                  </div>
                  <div>
                    <strong>Payment:</strong> Kummute Wallet
                  </div>
                </>
              )}
              
              {/* Show seat availability only after information is confirmed */}
              {filled && (
                <div style={{ 
                  padding: '0.5rem', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '8px',
                  border: '1px solid #dee2e6'
                }}>
                  <strong>Available Seats:</strong> {isLoadingSeats ? 'Loading...' : seatCount}
                  {!isLoadingSeats && (
                    <span style={{ 
                      marginLeft: '0.5rem', 
                      fontSize: '0.8rem', 
                      color: '#28a745' 
                    }}>
                      🟢 Live
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Show different button based on filled state */}
            {!filled ? (
              <button
                onClick={handleConfirmInfo}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Confirm Information
              </button>
            ) : (
              <button
                onClick={handleBook}
                disabled={isBookingRide}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: isBookingRide ? '#6c757d' : '#007bff',
                  color: '#fff',
                  fontWeight: 'bold',
                  cursor: isBookingRide ? 'not-allowed' : 'pointer',
                }}
              >
                {isBookingRide ? 'Booking...' : 'Book a Ride'}
              </button>
            )}
          </>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              textAlign: 'center',
              gap: '0.75rem',
            }}
          >
            <div className='flex w-full justify-around'>
              <div className='flex flex-col gap-2'>
                <img
                  src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${selectedUser?.id || 'driver'}`}
                  alt="Driver"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
                <p className='font-medium'>Dickson Tan - 4.8 ⭐</p>
              </div>
              <div className='flex flex-col text-right'>
                <p className='font-bold text-xl'>PRF 5463</p>
                <p className='tracking-tighter'>Rapid - Toyota Hiace</p>
              </div>
            </div>

            <Button className='w-3/4 bg-gray-200 text-gray-400 border-none'onClick={handleChat}>
              💬  Chat with your driver
            </Button>

            <Button className='w-full bg-red-400 border-none py-6 mt-5'onClick={handleEndRide}>
              Complete Ride
            </Button>

          </div>
        )}
      </div>
    </div>
  );
}