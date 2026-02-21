import React, { useState } from 'react';
import { searchNearbyPlaces, generateAIResponse } from '../utils/aiConfig';
import './AIAssistant.css';

function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hello! I\'m your CareConnect AI Assistant. I can help you find nearby NGOs, hospitals, schools, and answer questions about our platform. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('ngos');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      const botMessage = { type: 'bot', content: aiResponse };
      setMessages(prev => [...prev, botMessage]);
      setLoading(false);
    }, 1000);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchLocation.trim()) {
      alert('Please enter a location');
      return;
    }

    setLoading(true);
    const results = searchNearbyPlaces(searchLocation, searchType);
    setSearchResults(results);
    
    const searchMessage = {
      type: 'bot',
      content: `Found ${results.length} ${searchType} near "${searchLocation}". Check the results below!`
    };
    setMessages(prev => [...prev, searchMessage]);
    setLoading(false);
  };

  const quickQuestions = [
    'How does CareConnect work?',
    'How can I donate books?',
    'How do I become a volunteer?',
    'What is OTP verification?',
    'How can I track my donation?'
  ];

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  return (
    <div className="ai-assistant">
      <div className="ai-header">
        <h1>🤖 AI Assistant</h1>
        <p>Get instant help and find nearby organizations</p>
      </div>

      <div className="ai-container">
        <div className="chat-section">
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                <div className="message-avatar">
                  {message.type === 'bot' ? '🤖' : '👤'}
                </div>
                <div className="message-content">
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message bot">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="quick-questions">
            <p className="quick-questions-label">Quick Questions:</p>
            <div className="quick-questions-buttons">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="quick-question-btn"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question here..."
              className="chat-input"
            />
            <button type="submit" className="send-button">
              Send
            </button>
          </form>
        </div>

        <div className="search-section">
          <div className="search-container">
            <h2>🔍 Find Nearby Organizations</h2>
            <form onSubmit={handleSearch} className="search-form">
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Enter city or area (e.g., Mumbai, Pune)"
                  className="search-input"
                />
              </div>

              <div className="form-group">
                <label>Type</label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="search-select"
                >
                  <option value="ngos">NGOs</option>
                  <option value="hospitals">Hospitals</option>
                  <option value="schools">Schools</option>
                </select>
              </div>

              <button type="submit" className="search-button">
                Search
              </button>
            </form>
          </div>

          {searchResults && searchResults.length > 0 && (
            <div className="search-results">
              <h3>Search Results ({searchResults.length})</h3>
              <div className="results-list">
                {searchResults.map((result, index) => (
                  <div key={index} className="result-card">
                    <div className="result-header">
                      <h4>{result.name}</h4>
                      <span className="result-distance">{result.distance}</span>
                    </div>
                    <p className="result-address">📍 {result.address}</p>
                    <p className="result-phone">📞 {result.phone}</p>
                    <p className="result-email">📧 {result.email}</p>
                    {result.services && (
                      <div className="result-services">
                        <strong>Services:</strong> {result.services.join(', ')}
                      </div>
                    )}
                    <div className="result-actions">
                      <button className="result-btn contact">Contact</button>
                      <button className="result-btn directions">Get Directions</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="ai-info">
        <div className="info-card">
          <h3>💡 Smart Assistance</h3>
          <p>Get instant answers to your questions about donations, volunteering, and tracking.</p>
        </div>
        <div className="info-card">
          <h3>🗺️ Location Search</h3>
          <p>Find verified NGOs, hospitals, and schools near you to maximize your impact.</p>
        </div>
        <div className="info-card">
          <h3>🤝 Always Available</h3>
          <p>24/7 AI support to help you make informed decisions about your charitable activities.</p>
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;
