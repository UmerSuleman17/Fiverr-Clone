import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import useSocket from '../hooks/useSocket';
import toast from 'react-hot-toast';

const Chat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]); // for starting new chat
  const [sellerId, setSellerId] = useState('');
  const messagesEndRef = useRef(null);
  const socket = useSocket(localStorage.getItem('accessToken'));

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const res = await api.get('/conversations');
      setConversations(res.data);
    } catch (err) {
      toast.error('Failed to load conversations');
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (convId) => {
    setLoading(true);
    try {
      const res = await api.get(`/conversations/${convId}/messages`);
      setMessages(res.data.messages);
    } catch (err) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  // Get or create conversation with a seller
  const startChat = async () => {
    if (!sellerId) return toast.error('Please select a seller');
    try {
      const res = await api.get(`/conversations/create?sellerId=${sellerId}`);
      const conv = res.data;
      setSelectedConv(conv);
      fetchMessages(conv._id);
      fetchConversations();
    } catch (err) {
      toast.error('Failed to start chat');
    }
  };

  useEffect(() => {
    fetchConversations();
    // Fetch list of sellers (for simplicity, we can get from gigs, but we'll just have a input)
  }, []);

  useEffect(() => {
    if (selectedConv) {
      fetchMessages(selectedConv._id);
    }
  }, [selectedConv]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;
    socket.on('message', (msg) => {
      if (selectedConv && msg.conversation === selectedConv._id) {
        setMessages(prev => [...prev, msg]);
      }
      // Update conversation list (new message notification)
      fetchConversations();
    });
    socket.on('typing', ({ conversationId }) => {
      // Show typing indicator
    });
    socket.on('messageRead', (messageId) => {
      // Update read status if needed
    });
    return () => {
      socket.off('message');
      socket.off('typing');
      socket.off('messageRead');
    };
  }, [socket, selectedConv]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv) return;
    const text = newMessage.trim();
    socket.emit('message', { conversationId: selectedConv._id, text });
    setNewMessage('');
    // Optimistically add message (will be confirmed by server)
    // We'll rely on server echo
  };

  const handleTyping = () => {
    if (selectedConv) {
      socket.emit('typing', { conversationId: selectedConv._id });
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Conversations List */}
      <div className="w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
        <h3 className="font-bold mb-4">Conversations</h3>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Seller ID to start chat"
            value={sellerId}
            onChange={(e) => setSellerId(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700"
          />
          <button onClick={startChat} className="mt-2 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700">
            Start Chat
          </button>
        </div>
        {conversations.map(conv => {
          const other = conv.participants.find(p => p._id !== user.id);
          return (
            <div
              key={conv._id}
              className={`p-2 rounded cursor-pointer ${selectedConv?._id === conv._id ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              onClick={() => setSelectedConv(conv)}
            >
              <p className="font-medium">{other?.name || 'Unknown'}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {conv.lastMessage?.text || 'No messages yet'}
              </p>
            </div>
          );
        })}
        {conversations.length === 0 && <p className="text-gray-500">No conversations</p>}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            <div className="border-b border-gray-200 dark:border-gray-700 p-3 font-bold">
              {selectedConv.participants.find(p => p._id !== user.id)?.name || 'Chat'}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {loading ? (
                <div className="text-center py-10">Loading messages...</div>
              ) : messages.length === 0 ? (
                <p className="text-gray-500 text-center">No messages yet.</p>
              ) : (
                messages.map(msg => (
                  <div key={msg._id} className={`flex ${msg.sender._id === user.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-3 rounded-lg ${msg.sender._id === user.id ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                      <p>{msg.text}</p>
                      <span className="text-xs opacity-70">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="border-t border-gray-200 dark:border-gray-700 p-3 flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyUp={handleTyping}
                className="flex-1 p-2 border rounded dark:bg-gray-700"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation or start a new one.
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;