import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, MessageCircle, User, Bot } from 'lucide-react';

const DENTAL_TOPICS = [
  'tooth', 'teeth', 'gum', 'cavity', 'oral', 'mouth', 'dentist', 'dental', 'braces', 'root canal', 'crown', 'implant', 'wisdom tooth', 'bleeding', 'swelling', 'sensitivity', 'pain', 'extraction', 'filling', 'cleaning', 'orthodontics', 'periodontics', 'prosthodontics', 'endodontics', 'enamel', 'decay', 'infection', 'abscess', 'jaw', 'bite', 'chewing', 'floss', 'brush', 'plaque', 'tartar', 'x-ray', 'retainer', 'oral hygiene', 'mouthwash', 'halitosis', 'bad breath', 'ulcer', 'lesion', 'canker sore', 'dry mouth', 'saliva', 'tongue', 'palate', 'oral cancer', 'veneers', 'bridge', 'denture', 'orthodontist', 'periodontist', 'prosthodontist', 'endodontist'
];

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string; timestamp: Date }[]>([
    { 
      sender: 'bot', 
      text: 'Hello! Welcome to Dental CareCraft chat. How can I help you with your dental health questions today?', 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('AIzaSyBDTfWDltQqWFuF_ZStrUrti4ARqJGeJMA');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user' as const, text: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    if (!apiKey) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Please enter your Gemini API key to use the chatbot.', timestamp: new Date() }]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are a helpful dental health assistant. Only answer questions if they are related to dental, oral, or general health topics. If the question is not about health or medicine, politely say you can only answer medical/health-related questions. User: ${input}` }] }]
        })
      });
      const data = await res.json();
      let botText = 'Sorry, I could not get a response.';
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        botText = data.candidates[0].content.parts[0].text;
      } else if (data.error && data.error.message) {
        botText = 'Error: ' + data.error.message;
      }
      setMessages((prev) => [...prev, { sender: 'bot', text: botText, timestamp: new Date() }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Error connecting to Gemini API.', timestamp: new Date() }]);
    }
    setLoading(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="flex flex-col h-full max-w-4xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <MessageCircle className="w-6 h-6" />
          <div>
            <h2 className="text-xl font-bold">Dental Health Assistant</h2>
            <p className="text-blue-100 text-sm">Ask me anything about dental care</p>
          </div>
        </div>

        {/* API Key Input */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <Input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key to enable chat"
            className="text-sm"
          />
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} group`}
            >
              <div className={`flex items-start gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                  msg.sender === 'user' 
                    ? 'bg-blue-500' 
                    : 'bg-green-500'
                }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 max-w-full text-sm shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-blue-500 text-white rounded-br-md'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <span className={`text-xs text-gray-500 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Type your dental health question..."
              className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              disabled={loading}
            />
            <Button 
              onClick={handleSend} 
              disabled={loading || !input.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Messages; 