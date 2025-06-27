import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const symptomResponses: { [key: string]: string } = {
  toothache: 'For toothache, rinse your mouth with warm water and use dental floss to remove any food debris. If pain persists, take an over-the-counter pain reliever and see a dentist as soon as possible.',
  bleeding: 'If you have bleeding gums, gently rinse your mouth with cold water and apply pressure with a clean gauze. If bleeding continues, contact your dentist.',
  swelling: 'For swelling, apply a cold compress to the outside of your cheek and avoid hot foods. If swelling is severe, seek dental care immediately.',
  sensitivity: 'For sensitivity, avoid very hot or cold foods and use toothpaste for sensitive teeth.',
  cavity: 'If you suspect a cavity, avoid sugary foods and keep the area clean. Schedule a dental appointment for treatment.'
};

const defaultResponses = [
  'Thank you for your message. How can I assist you today?',
  'Can you describe your symptoms in more detail?',
  'If you are experiencing pain, please let me know where and how severe it is.'
];

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    { sender: 'bot', text: 'Hello! Welcome to Dental CareCraft chat. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user' as const, text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Check for symptom keywords
    const lowerInput = input.toLowerCase();
    let response = '';
    for (const keyword in symptomResponses) {
      if (lowerInput.includes(keyword)) {
        response = symptomResponses[keyword];
        break;
      }
    }
    if (!response) {
      response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'bot' as const, text: response }]);
    }, 600);
    setInput('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50 py-8">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Messages</h2>
        <div className="flex flex-col gap-2 mb-4 max-h-80 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] text-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </Card>
    </div>
  );
};

export default Messages; 