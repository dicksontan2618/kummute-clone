// File: app/chat/[userId]/page.tsx

'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useParams } from 'next/navigation';
import Swal from 'sweetalert2';
import { User, Conversation, Message } from './types';

export default function Chat() {
  const supabase = createClient();
  const params = useParams();
  const selectedUserId = params.userId as string;
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');

  // Get logged-in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser({ id: user.id, email: user.email! });
    });
  }, []);

  // Fetch selected user and initialize conversation
  useEffect(() => {
    if (!user || !selectedUserId) return;

    const fetchData = async () => {
      const { data: selectedUserData } = await supabase
        .from('users')
        .select('*')
        .eq('id', selectedUserId)
        .single();

      if (!selectedUserData) return;

      setSelectedUser(selectedUserData);

      Swal.fire({
        title: 'Connected!',
        text: 'You can now chat with the other user.',
        icon: 'info',
        confirmButtonText: 'OK',
      });

      const { data: existing } = await supabase
        .from('conversations')
        .select('*')
        .or(
          `and(user1.eq.${user.id},user2.eq.${selectedUserId}),and(user1.eq.${selectedUserId},user2.eq.${user.id})`
        )
        .limit(1)
        .maybeSingle();

      if (existing) {
        setConversation(existing);
      } else {
        const { data: created } = await supabase
          .from('conversations')
          .insert({ user1: user.id, user2: selectedUserId })
          .select()
          .single();
        setConversation(created);
      }
    };

    fetchData();
  }, [user, selectedUserId]);

  useEffect(() => {
    if (!conversation) return;

    fetchMessages();

    const channel = supabase
      .channel(`conversation-${conversation.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversation.id}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversation?.id)
      .order('created_at');

    if (data) setMessages(data);
  };

  const sendMessage = async () => {
    if (!text.trim() || !conversation || !user) return;
    await supabase.from('messages').insert({
      conversation_id: conversation.id,
      sender_id: user.id,
      content: text,
    });
    setText('');
  };

  if (!user || !selectedUser || !conversation) return <div>Loading...</div>;

  const getDisplayName = (email: string) => {
    if (email === 'user@gmail.com') return 'Then Tai Yu';
    if (email === 'user2@gmail.com') return 'Dickson Tan';
    return email;
  };

  return (
    <div style={{ display: 'flex', height: '100%', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
        Chatting with {getDisplayName(selectedUser.email)}
      </div>

      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {messages.map((msg) => {
          const isMe = msg.sender_id === user.id;
          return (
            <div key={msg.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap: '0.5rem', alignItems: 'flex-start' }}>
              <img
                src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${isMe ? user.id : selectedUser.id}`}
                style={{ width: 32, height: 32, borderRadius: '50%' }}
                alt="avatar"
              />
              <div style={{ backgroundColor: isMe ? '#dcf8c6' : '#fff', padding: '0.5rem 1rem', borderRadius: '20px', maxWidth: '70%', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: '1rem', borderTop: '1px solid #ddd', display: 'flex', gap: '0.5rem' }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: '0.75rem', borderRadius: '20px', border: '1px solid #ccc' }}
        />
        <button onClick={sendMessage} style={{ padding: '0.75rem 1.25rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '20px' }}>
          Send
        </button>
      </div>
    </div>
  );
}