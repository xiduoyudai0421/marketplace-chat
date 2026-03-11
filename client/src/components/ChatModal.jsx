import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './ChatModal.css';

const ChatModal = ({ productId, sellerName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const [currentUser] = useState('用户_' + Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    // Initialize Socket.IO connection
    socketRef.current = io('http://localhost:5000');

    // Join chat room
    socketRef.current.emit('join_chat', {
      productId,
      userId: currentUser,
      sellerName
    });

    // Listen for incoming messages
    socketRef.current.on('receive_message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    // Listen for user joined
    socketRef.current.on('user_joined', (data) => {
      setIsOnline(true);
      setMessages(prev => [...prev, {
        message: data.message,
        sender: 'system',
        timestamp: new Date()
      }]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [productId, currentUser, sellerName]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const message = {
      message: inputValue,
      sender: currentUser,
      senderName: '我',
      roomId: `chat_${productId}_${currentUser}`,
      timestamp: new Date()
    };

    socketRef.current.emit('send_message', message);
    setMessages(prev => [...prev, message]);
    setInputValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };  

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal">
        {/* Header */}
        <div className="chat-header">
          <div className="seller-info">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sellerName}`} alt="seller" className="seller-avatar" />
            <div className="seller-details">
              <h3>{sellerName}</h3>
              <span className={`status ${isOnline ? 'online' : 'offline'}`}>  
                {isOnline ? '●在线' : '●离线'}
              </span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Messages */}
        <div className="messages-container">
          {messages.length === 0 && (
            <div className="empty-state">
              <p>开始与卖家聊天</p>
              <small>您的消息对双方都是私密的</small>
            </div>
          )}
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender === currentUser ? 'sent' : 'received'}`}>  
              {msg.sender !== currentUser && msg.sender !== 'system' && (
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sellerName}`} alt="sender" className="message-avatar" />
              )}  
              <div className="message-content">
                <span className="message-text">{msg.message}</span>
                <span className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}  
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chat-input-container">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息..."
            className="chat-input"
          />
          <button onClick={handleSendMessage} className="send-btn">发送</button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;