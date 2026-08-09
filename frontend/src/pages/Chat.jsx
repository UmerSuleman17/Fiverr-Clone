import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/api';
import useSocket from '../hooks/useSocket';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import toast from 'react-hot-toast';
import { FaPaperPlane, FaComments, FaSearch, FaUserCircle, FaCircle } from 'react-icons/fa';

const Chat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sellerId, setSellerId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  const socket = useSocket();

  const userId = user?.id || user?._id;

  const fetchConversations = async () => {
    try {
      const res = await api.get('/conversations');
      setConversations(res.data || []);
    } catch (err) {
      toast.error('Failed to load conversations');
    }
  };

  const fetchMessages = async (convId) => {
    setLoading(true);
    try {
      const res = await api.get(`/conversations/${convId}/messages`);
      setMessages(res.data.messages || []);
    } catch (err) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const startChat = async () => {
    if (!sellerId.trim()) return toast.error('Please enter a valid Seller ID');
    try {
      const res = await api.get(`/conversations/create?sellerId=${sellerId.trim()}`);
      const conv = res.data;
      setSelectedConv(conv);
      fetchMessages(conv._id);
      fetchConversations();
      setSellerId('');
    } catch (err) {
      toast.error('Failed to start conversation');
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConv) {
      fetchMessages(selectedConv._id);
      if (socket) {
        socket.emit('joinConversation', selectedConv._id);
      }
      return () => {
        if (socket) {
          socket.emit('leaveConversation', selectedConv._id);
        }
      };
    }
  }, [selectedConv, socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on('newMessage', (msg) => {
      if (selectedConv && msg.conversation === selectedConv._id) {
        setMessages((prev) => [...prev, msg]);
      }
      fetchConversations();
    });
    return () => {
      socket.off('newMessage');
    };
  }, [socket, selectedConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv || !socket) return;
    const text = newMessage.trim();
    socket.emit('sendMessage', { conversationId: selectedConv._id, text });
    setNewMessage('');
  };

  const filteredConversations = conversations.filter((c) => {
    const other = c.participants?.find((p) => p._id !== userId);
    return other?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Real-Time Messages
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Communicate directly with buyers and sellers on your active orders
        </p>
      </div>

      {/* Main Chat Box */}
      <div className="card h-[680px] flex flex-col md:flex-row p-0 overflow-hidden shadow-soft-lg border-slate-200 dark:border-slate-800">
        
        {/* Left Participants Sidebar */}
        <div className="w-full md:w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
          
          {/* Start New Chat Input */}
          <div className="p-4 space-y-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Direct Message</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Seller ID..."
                value={sellerId}
                onChange={(e) => setSellerId(e.target.value)}
                className="input-field py-1.5 text-xs flex-1"
              />
              <button onClick={startChat} className="btn-primary py-1.5 px-3 text-xs shrink-0 font-bold">
                Chat
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 relative">
            <input
              type="text"
              placeholder="Filter chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field py-1.5 pl-8 text-xs bg-slate-100 dark:bg-slate-800"
            />
            <FaSearch className="absolute left-5 top-3.5 text-slate-400 text-xs" />
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No active chats found.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const other = conv.participants?.find((p) => p._id !== userId) || {};
                const isSelected = selectedConv?._id === conv._id;
                const avatar = other.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';

                return (
                  <button
                    key={conv._id}
                    onClick={() => setSelectedConv(conv)}
                    className={`w-full p-4 text-left flex items-center space-x-3 transition-colors ${
                      isSelected
                        ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border-l-4 border-emerald-500'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img src={avatar} alt={other.name} className="w-10 h-10 rounded-full object-cover border" />
                      <FaCircle className="absolute bottom-0 right-0 text-[10px] text-emerald-500 border-2 border-white dark:border-slate-900" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="font-bold text-xs text-slate-900 dark:text-white truncate">{other.name || 'User'}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {conv.lastMessage?.text || 'Click to open conversation'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

        </div>

        {/* Right Active Message Window */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
          {selectedConv ? (
            <>
              {/* Top Chat Header */}
              {(() => {
                const other = selectedConv.participants?.find((p) => p._id !== userId) || {};
                const avatar = other.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';
                return (
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center space-x-3">
                      <img src={avatar} alt={other.name} className="w-9 h-9 rounded-full object-cover border" />
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">{other.name || 'Chat Participant'}</h3>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <FaCircle className="text-[8px]" /> Active Now
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Messages Flow */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loading ? (
                  <Loader />
                ) : messages.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-10">No messages yet. Send a message below to start chatting.</p>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender?._id === userId || msg.sender === userId;
                    return (
                      <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-md px-4 py-2.5 rounded-2xl text-xs space-y-1 ${
                            isMe
                              ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
                          }`}
                        >
                          <p className="leading-relaxed">{msg.text}</p>
                          <span className={`text-[9px] block text-right font-medium ${isMe ? 'text-emerald-100' : 'text-slate-400'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form Footer */}
              <form onSubmit={sendMessage} className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-2 bg-slate-50/30 dark:bg-slate-900/30">
                <input
                  type="text"
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="input-field text-xs py-2.5 flex-1"
                />
                <button type="submit" className="btn-primary py-2.5 px-5 text-xs font-bold shrink-0">
                  <FaPaperPlane /> Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mb-4">
                <FaComments />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Select a Conversation</h3>
              <p className="text-xs text-slate-400 max-w-sm">Choose a chat from the left sidebar or enter a seller ID to send a direct message.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Chat;