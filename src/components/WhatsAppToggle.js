import React, { useState, useEffect, useRef, useCallback } from 'react';
import './WhatsAppToggle.css';

const WhatsAppToggle = () => {
  const [position, setPosition] = useState(() => {
    const isMobile = window.innerWidth <= 768;
    return {
      x: isMobile ? window.innerWidth - 80 : window.innerWidth - 100,
      y: window.innerHeight - 120
    };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [showChatBox, setShowChatBox] = useState(false);
  const [message, setMessage] = useState("");
  const toggleRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - 80),
        y: Math.min(prev.y, window.innerHeight - 80)
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Common move handler
  const handleMove = useCallback((clientX, clientY) => {
    const newX = clientX - startPos.current.x;
    const newY = clientY - startPos.current.y;
    
    setPosition({
      x: Math.max(10, Math.min(newX, window.innerWidth - 80)),
      y: Math.max(10, Math.min(newY, window.innerHeight - 80))
    });
  }, []);

  // Mouse event handlers
  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.whatsapp-button')) {
      startPos.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
      };
      setIsDragging(true);
      e.preventDefault();
    }
  }, [position.x, position.y]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      handleMove(e.clientX, e.clientY);
      e.preventDefault();
    }
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch event handlers
  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    startPos.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    };
    setIsDragging(true);
    e.preventDefault();
  }, [position.x, position.y]);

  const handleTouchMove = useCallback((e) => {
    if (isDragging) {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
      e.preventDefault();
    }
  }, [isDragging, handleMove]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add and remove event listeners
  useEffect(() => {
    const currentRef = toggleRef.current;
    
    if (currentRef) {
      // Mouse events
      currentRef.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      // Touch events (with passive: false to allow preventDefault)
      currentRef.addEventListener('touchstart', handleTouchStart, { passive: false });
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        // Mouse events
        currentRef.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        
        // Touch events
        currentRef.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleTouchEnd, handleTouchMove, handleTouchStart]);

  const toggleChatBox = useCallback(() => {
    setShowChatBox(!showChatBox);
  }, [showChatBox]);

  const handleSendMessage = useCallback(() => {
    if (message.trim()) {
      window.open(`https://wa.me/919067690333?text=${encodeURIComponent(message)}`, '_blank');
      setMessage("");
      setShowChatBox(false);
    }
  }, [message]);

  return (
    <div 
      ref={toggleRef}
      className="whatsapp-float"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'pointer'
      }}
    >
      <div className="position-relative">
        {showChatBox && (
          <div 
            className="whatsapp-chat-box shadow-lg"
            onClick={(e) => e.stopPropagation()}
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
          onClick={toggleChatBox}
        >
          <i className="bi bi-whatsapp fs-4"></i>
        </button>
      </div>
    </div>
  );
};

export default WhatsAppToggle;