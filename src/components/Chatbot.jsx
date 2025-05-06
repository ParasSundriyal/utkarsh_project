import React, { useState } from 'react';
import styles from './Chatbot.module.css';

const initialMessages = [
  { from: 'bot', text: 'Hello! How can I help you today?' },
  { from: 'user', text: 'How do I submit a complaint?' },
  { from: 'bot', text: 'Click on the Submit page and upload a photo of the issue.' },
];

const Chatbot = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { from: 'user', text: input }]);
      setInput('');
      // Simulate bot reply
      setTimeout(() => {
        setMessages((msgs) => [
          ...msgs,
          { from: 'bot', text: 'Thank you for your message! (This is a sample reply.)' },
        ]);
      }, 800);
    }
  };

  return (
    <div className={styles.chatbotContainer}>
      <div className={styles.messages}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={msg.from === 'bot' ? styles.botMsg : styles.userMsg}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className={styles.inputRow}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot; 