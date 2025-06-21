import React, { useState, useEffect, useRef } from 'react';
import './WhatsAppToggle.css';

const WhatsAppToggle = () => {
  const [position, setPosition] = useState({ 
    x: window.innerWidth / 2 - 30, // Center horizontally
    y: window.innerHeight - 100    // Position near bottom
  });
  const [isDragging, setIsDragging] = useState(false);
  const [showChatBox, setShowChatBox] = useState(false);
  const [message, setMessage] = useState("");
  const [whatsappVisible, setWhatsappVisible] = useState(true);
  const toggleRef = useRef(null);

  // Handle window resize to keep toggle visible
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - 60),
        y: Math.min(prev.y, window.innerHeight - 60)
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDown = (e) => {
    // Only start dragging if clicking on the button, not the chat box
    if (!showChatBox || e.target.closest('.whatsapp-button')) {
      setIsDragging(true);
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - 30;
    const newY = e.clientY - 30;
    
    setPosition({
      x: Math.max(10, Math.min(newX, window.innerWidth - 70)),
      y: Math.max(10, Math.min(newY, window.innerHeight - 70))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleChatBox = () => {
    setShowChatBox(!showChatBox);
    setWhatsappVisible(true);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      window.open(`https://wa.me/919284389450?text=${encodeURIComponent(message)}`, '_blank');
      setMessage("");
      setShowChatBox(false);
    }
  };

  return (
    <div 
      ref={toggleRef}
      className={`whatsapp-float ${whatsappVisible ? 'whatsapp-visible' : 'whatsapp-hidden'}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="position-relative">
        {showChatBox && (
          <div 
            className="whatsapp-chat-box shadow-lg"
            onClick={(e) => e.stopPropagation()} // Prevent drag when clicking inside chat box
          >
            <div className="chat-header bg-success text-white p-3 rounded-top">
              <h6 className="mb-0">Divine Guidance</h6>
              <button 
                className="btn-close btn-close-white btn-sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowChatBox(false);
                }}
              ></button>
            </div>
            <div className="chat-body p-3 bg-light">
              <p className="small mb-3">Hello! How can we help you on your spiritual journey?</p>
              <textarea 
                className="form-control mb-2" 
                rows="3" 
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              ></textarea>
              <button 
                className="btn btn-success w-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSendMessage();
                }}
              >
                Send <i className="bi bi-whatsapp ms-2"></i>
              </button>
            </div>
          </div>
        )}
        <button 
          className="whatsapp-button btn btn-success rounded-circle p-3 shadow"
          onClick={(e) => {
            e.stopPropagation();
            toggleChatBox();
          }}
        >
          <i className="bi bi-whatsapp fs-4"></i>
        </button>
      </div>
    </div>
  );
};

export default WhatsAppToggle;