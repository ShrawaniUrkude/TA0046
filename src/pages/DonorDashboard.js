import React, { useState } from 'react';
import DonationTracker from '../components/DonationTracker';
import './DonorDashboard.css';

function DonorDashboard() {
  const [formData, setFormData] = useState({
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    bookTitle: '',
    author: '',
    quantity: '',
    condition: 'New',
    category: 'Fiction',
    pickupAddress: '',
    pickupCity: '',
    pickupState: '',
    pickupZip: '',
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [donationSubmitted, setDonationSubmitted] = useState(false);
  const [currentDonation, setCurrentDonation] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    // Simulate OTP sending
    alert(`OTP sent to ${formData.donorPhone}`);
    setOtpSent(true);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    // Simulate OTP verification (in real app, verify with backend)
    if (otpValue === '123456' || otpValue.length === 6) {
      alert('OTP verified successfully!');
      setOtpVerified(true);
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const handleSubmitDonation = (e) => {
    e.preventDefault();
    
    if (!otpVerified) {
      alert('Please verify OTP first');
      return;
    }

    // Create donation object with unique ID
    const donation = {
      id: `DON${Date.now()}`,
      ...formData,
      status: 'pending',
      timestamp: new Date().toISOString(),
      pickupLocation: {
        address: `${formData.pickupAddress}, ${formData.pickupCity}, ${formData.pickupState} ${formData.pickupZip}`,
        coordinates: null // Will be geocoded by the tracker
      }
    };

    // Store in localStorage
    const existingDonations = JSON.parse(localStorage.getItem('donations') || '[]');
    existingDonations.push(donation);
    localStorage.setItem('donations', JSON.stringify(existingDonations));

    setCurrentDonation(donation);
    setDonationSubmitted(true);
    alert('Donation submitted successfully! Track your donation below.');
  };

  const handleReset = () => {
    setFormData({
      donorName: '',
      donorEmail: '',
      donorPhone: '',
      bookTitle: '',
      author: '',
      quantity: '',
      condition: 'New',
      category: 'Fiction',
      pickupAddress: '',
      pickupCity: '',
      pickupState: '',
      pickupZip: '',
    });
    setOtpSent(false);
    setOtpValue('');
    setOtpVerified(false);
    setDonationSubmitted(false);
    setCurrentDonation(null);
  };

  return (
    <div className="donor-dashboard">
      <div className="dashboard-header">
        <h1>Donor Dashboard</h1>
        <p>Make a difference by donating books to those in need</p>
      </div>

      {!donationSubmitted ? (
        <div className="donation-form-container">
          <form className="donation-form" onSubmit={otpVerified ? handleSubmitDonation : handleSendOtp}>
            <div className="form-section">
              <h2>Donor Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="donorName"
                    value={formData.donorName}
                    onChange={handleInputChange}
                    required
                    disabled={otpVerified}
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="donorEmail"
                    value={formData.donorEmail}
                    onChange={handleInputChange}
                    required
                    disabled={otpVerified}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <div className="otp-input-group">
                  <input
                    type="tel"
                    name="donorPhone"
                    value={formData.donorPhone}
                    onChange={handleInputChange}
                    required
                    disabled={otpSent}
                    placeholder="Enter 10-digit phone number"
                  />
                  {!otpSent && (
                    <button type="submit" className="otp-button">
                      Send OTP
                    </button>
                  )}
                </div>
              </div>

              {otpSent && !otpVerified && (
                <div className="form-group">
                  <label>Enter OTP *</label>
                  <div className="otp-input-group">
                    <input
                      type="text"
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="otp-button verify"
                    >
                      Verify OTP
                    </button>
                  </div>
                  <small className="otp-hint">Use any 6-digit code for demo</small>
                </div>
              )}

              {otpVerified && (
                <div className="verification-badge">
                  ✓ Phone Verified
                </div>
              )}
            </div>

            {otpVerified && (
              <>
                <div className="form-section">
                  <h2>Book Details</h2>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Book Title *</label>
                      <input
                        type="text"
                        name="bookTitle"
                        value={formData.bookTitle}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Author *</label>
                      <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Quantity *</label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        min="1"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Condition *</label>
                      <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="New">New</option>
                        <option value="Like New">Like New</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Fiction">Fiction</option>
                      <option value="Non-Fiction">Non-Fiction</option>
                      <option value="Educational">Educational</option>
                      <option value="Children">Children's Books</option>
                      <option value="Reference">Reference</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-section">
                  <h2>Pickup Address</h2>
                  <div className="form-group">
                    <label>Street Address *</label>
                    <input
                      type="text"
                      name="pickupAddress"
                      value={formData.pickupAddress}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        name="pickupCity"
                        value={formData.pickupCity}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>State *</label>
                      <input
                        type="text"
                        name="pickupState"
                        value={formData.pickupState}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>ZIP Code *</label>
                    <input
                      type="text"
                      name="pickupZip"
                      value={formData.pickupZip}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="submit-button">
                    Submit Donation
                  </button>
                  <button type="button" onClick={handleReset} className="reset-button">
                    Reset Form
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      ) : (
        <div className="donation-success">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Donation Submitted Successfully!</h2>
            <p>Your donation ID: <strong>{currentDonation.id}</strong></p>
            <p>A volunteer will be assigned to pick up your donation soon.</p>
            <button onClick={handleReset} className="new-donation-button">
              Make Another Donation
            </button>
          </div>

          <div className="tracker-section">
            <h2>Track Your Donation</h2>
            <DonationTracker donationId={currentDonation.id} />
          </div>
        </div>
      )}

      <div className="dashboard-info">
        <div className="info-card">
          <h3>📚 Why Donate Books?</h3>
          <p>Your donated books can change lives by providing education and knowledge to those who need it most.</p>
        </div>
        <div className="info-card">
          <h3>🔒 Safe & Secure</h3>
          <p>OTP verification ensures your donations are tracked securely from pickup to delivery.</p>
        </div>
        <div className="info-card">
          <h3>📍 Live Tracking</h3>
          <p>Track your donation in real-time and see exactly where your books are helping.</p>
        </div>
      </div>
    </div>
  );
}

export default DonorDashboard;
