'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '../chat/[userId]/types';

export default function DecisionPage() {
  const supabase = createClient();
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [booked, setBooked] = useState(false); // Track if user has booked

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


  const handleBook = () => {
    setBooked(true);
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
                gap: '0.5rem',
                marginBottom: '1rem',
              }}
            >
              <div>
                <strong>Pick-up:</strong> Muzium Negara, Jalan Damansara, 50566 Kuala Lumpur, W.P Kuala Lumpur
              </div>
              <div>
                <strong>Drop-off:</strong> Jalan Tun Perak, 50050 Kuala Lumpur
              </div>
              <div>
                <strong>Payment:</strong> Kummute Wallet
              </div>
              <div>
                <strong>Passenger:</strong> 1
              </div>
            </div>

            <button
              onClick={handleBook}
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
              Book a Ride
            </button>
          </>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '0.75rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              <img
                src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${selectedUser?.id || 'driver'}`}
                alt="Driver"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
              <div style={{ textAlign: 'left' }}>
                <div><strong>Name:</strong>Then Tai Yu</div>
                <div><strong>Age:</strong>25</div>
              </div>
            </div>

            <button
              onClick={handleChat}
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
              Chat with Driver
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
