import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Hash, 
  Plus, 
  Search,
  MoreHorizontal,
  Smile,
  Image as ImageIcon
} from 'lucide-react';
import { User, ChatMessage } from '../types';
import { CHANNELS } from '../constants';
import { Language, translations } from '../translations';

interface ChatProps {
  currentUser: User;
  language: Language;
}

const Chat: React.FC<ChatProps> = ({ currentUser, language }) => {
  const t = translations[language];
  
  const getChannelLabel = (channel: string) => {
    switch (channel) {
      case 'Lager': return t.warehouse;
      case 'Verkauf': return t.sales;
      case 'Dringend': return t.urgent;
      case 'Allgemein': return t.general;
      default: return channel;
    }
  };

  const [activeChannel, setActiveChannel] = useState(CHANNELS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'System', text: t.welcomeToChannel, timestamp: Date.now() - 3600000, channel: 'Lager' },
    { id: '2', sender: 'Max', text: 'Haben wir noch DDR5 RAM auf Lager?', timestamp: Date.now() - 1800000, channel: 'Lager' },
    { id: '3', sender: 'Lisa', text: 'Ja, im Regal B4 liegen noch 10 Stück.', timestamp: Date.now() - 900000, channel: 'Lager' },
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChannel]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: currentUser.name,
      text: inputText,
      timestamp: Date.now(),
      channel: activeChannel
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  const filteredMessages = messages.filter(m => m.channel === activeChannel);

  return (
    <div className="flex h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Channels Sidebar */}
      <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">{t.channels}</h3>
          <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all">
            <Plus size={18} />
          </button>
        </div>
        <div className="p-4 space-y-1 flex-1 overflow-y-auto">
          {CHANNELS.map(channel => (
            <button
              key={channel}
              onClick={() => setActiveChannel(channel)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activeChannel === channel
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:bg-white/50 hover:text-slate-900'
              }`}
            >
              <Hash size={16} className={activeChannel === channel ? 'text-indigo-600' : 'text-slate-400'} />
              {getChannelLabel(channel)}
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder={t.search + "..."}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash size={20} className="text-slate-400" />
            <h2 className="font-bold text-slate-900">{getChannelLabel(activeChannel)}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
              <Search size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {filteredMessages.map((msg, index) => {
            const isMe = msg.sender === currentUser.name;
            const showAvatar = index === 0 || filteredMessages[index - 1].sender !== msg.sender;

            return (
              <div key={msg.id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex-shrink-0 bg-slate-100 overflow-hidden ${!showAvatar ? 'opacity-0' : ''}`}>
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender}`} alt={msg.sender} />
                </div>
                <div className={`max-w-[70%] ${isMe ? 'text-right' : ''}`}>
                  {showAvatar && (
                    <div className={`flex items-center gap-2 mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <span className="text-sm font-bold text-slate-900">{msg.sender}</span>
                      <span className="text-[10px] text-slate-400">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )}
                  <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm border ${
                    isMe 
                      ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none' 
                      : 'bg-slate-50 text-slate-800 border-slate-100 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={`${t.messageTo} #${getChannelLabel(activeChannel)}`}
              className="w-full bg-transparent border-none focus:ring-0 text-sm p-2 resize-none h-20"
            />
            <div className="flex items-center justify-between px-2 pb-1">
              <div className="flex items-center gap-1">
                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all">
                  <Paperclip size={18} />
                </button>
                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all">
                  <ImageIcon size={18} />
                </button>
                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all">
                  <Smile size={18} />
                </button>
              </div>
              <button 
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:hover:bg-indigo-600 shadow-md shadow-indigo-100"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
