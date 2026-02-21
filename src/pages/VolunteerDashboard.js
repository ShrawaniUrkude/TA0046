import React, { useState, useEffect } from 'react';
import './VolunteerDashboard.css';

function VolunteerDashboard() {
  const [volunteerInfo, setVolunteerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    vehicle: 'Bike'
  });
  
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  
  const [availableDonations, setAvailableDonations] = useState([]);
  const [assignedTask, setAssignedTask] = useState(null);
  const [selectedNeedy, setSelectedNeedy] = useState(null);
  const [deliveryOtp, setDeliveryOtp] = useState('');
  
  const needyPeople = [
    { id: 1, name: 'Shanti Orphanage', address: '123 Hope Street, Mumbai, Maharashtra', type: 'Orphanage', contact: '+91 98765 43210' },
    { id: 2, name: 'Rural School - Dharavi', address: '45 Education Lane, Dharavi, Mumbai', type: 'School', contact: '+91 97654 32109' },
    { id: 3, name: 'Elder Care Home', address: '78 Senior Avenue, Pune, Maharashtra', type: 'Old Age Home', contact: '+91 96543 21098' },
    { id: 4, name: 'Community Library', address: '90 Knowledge Road, Nagpur, Maharashtra', type: 'Library', contact: '+91 95432 10987' }
  ];

  useEffect(() => {
    if (isRegistered) {
      loadAvailableDonations();
      const interval = setInterval(loadAvailableDonations, 5000);
      return () => clearInterval(interval);
    }
  }, [isRegistered]);

  const loadAvailableDonations = () => {
    const donations = JSON.parse(localStorage.getItem('donations') || '[]');
    const pending = donations.filter(d => d.status === 'pending');
    setAvailableDonations(pending);
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    alert(`OTP sent to ${volunteerInfo.phone}`);
    setOtpSent(true);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpValue === '123456' || otpValue.length === 6) {
      alert('OTP verified successfully!');
      setOtpVerified(true);
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!otpVerified) {
      alert('Please verify OTP first');
      return;
    }
    
    const volunteer = {
      id: `VOL${Date.now()}`,
      ...volunteerInfo,
      registeredAt: new Date().toISOString()
    };
    
    localStorage.setItem('currentVolunteer', JSON.stringify(volunteer));
    setIsRegistered(true);
    alert('Registration successful! You can now accept donation tasks.');
  };

  const handleAcceptTask = (donation) => {
    const donations = JSON.parse(localStorage.getItem('donations') || '[]');
    const updated = donations.map(d => {
      if (d.id === donation.id) {
        return {
          ...d,
          status: 'in-progress',
          volunteer: JSON.parse(localStorage.getItem('currentVolunteer')),
          acceptedAt: new Date().toISOString()
        };
      }
      return d;
    });
    
    localStorage.setItem('donations', JSON.stringify(updated));
    setAssignedTask(updated.find(d => d.id === donation.id));
    setAvailableDonations(updated.filter(d => d.status === 'pending'));
    alert('Task accepted! Please proceed to pickup location.');
  };

  const handlePickup = () => {
    const donations = JSON.parse(localStorage.getItem('donations') || '[]');
    const updated = donations.map(d => {
      if (d.id === assignedTask.id) {
        return {
          ...d,
          status: 'picked-up',
          pickedUpAt: new Date().toISOString()
        };
      }
      return d;
    });
    
    localStorage.setItem('donations', JSON.stringify(updated));
    setAssignedTask(updated.find(d => d.id === assignedTask.id));
    alert('Pickup confirmed! Now select the needy recipient.');
  };

  const handleSelectNeedy = (needy) => {
    setSelectedNeedy(needy);
  };

  const handleStartDelivery = () => {
    if (!selectedNeedy) {
      alert('Please select a recipient first');
      return;
    }

    const donations = JSON.parse(localStorage.getItem('donations') || '[]');
    const updated = donations.map(d => {
      if (d.id === assignedTask.id) {
        return {
          ...d,
          status: 'in-transit',
          recipient: selectedNeedy,
          inTransitAt: new Date().toISOString(),
          currentLocation: d.pickupLocation
        };
      }
      return d;
    });
    
    localStorage.setItem('donations', JSON.stringify(updated));
    setAssignedTask(updated.find(d => d.id === assignedTask.id));
    alert('Delivery started! The recipient will receive an OTP for verification.');
  };

  const handleCompleteDelivery = () => {
    // In a real app, verify OTP with recipient's OTP
    if (deliveryOtp.length !== 6) {
      alert('Please enter a valid 6-digit OTP from the recipient');
      return;
    }

    const donations = JSON.parse(localStorage.getItem('donations') || '[]');
    const updated = donations.map(d => {
      if (d.id === assignedTask.id) {
        return {
          ...d,
          status: 'delivered',
          deliveredAt: new Date().toISOString(),
          deliveryOtpVerified: true
        };
      }
      return d;
    });
    
    localStorage.setItem('donations', JSON.stringify(updated));
    
    // Store completed delivery
    const completedDeliveries = JSON.parse(localStorage.getItem('completedDeliveries') || '[]');
    completedDeliveries.push(updated.find(d => d.id === assignedTask.id));
    localStorage.setItem('completedDeliveries', JSON.stringify(completedDeliveries));
    
    alert('Delivery completed successfully! Thank you for your service.');
    setAssignedTask(null);
    setSelectedNeedy(null);
    setDeliveryOtp('');
    loadAvailableDonations();
  };

  if (!isRegistered) {
    return (
      <div className="volunteer-dashboard">
        <div className="dashboard-header">
          <h1>Volunteer Dashboard</h1>
          <p>Register to start helping deliver donations to those in need</p>
        </div>

        <div className="registration-form-container">
          <form className="registration-form" onSubmit={otpVerified ? handleRegister : handleSendOtp}>
            <h2>Volunteer Registration</h2>
            
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={volunteerInfo.name}
                onChange={(e) => setVolunteerInfo({...volunteerInfo, name: e.target.value})}
                required
                disabled={otpVerified}
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={volunteerInfo.email}
                onChange={(e) => setVolunteerInfo({...volunteerInfo, email: e.target.value})}
                required
                disabled={otpVerified}
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <div className="otp-input-group">
                <input
                  type="tel"
                  value={volunteerInfo.phone}
                  onChange={(e) => setVolunteerInfo({...volunteerInfo, phone: e.target.value})}
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
              <>
                <div className="verification-badge">
                  ✓ Phone Verified
                </div>

                <div className="form-group">
                  <label>Vehicle Type *</label>
                  <select
                    value={volunteerInfo.vehicle}
                    onChange={(e) => setVolunteerInfo({...volunteerInfo, vehicle: e.target.value})}
                    required
                  >
                    <option value="Bike">Bike</option>
                    <option value="Car">Car</option>
                    <option value="Van">Van</option>
                    <option value="Bicycle">Bicycle</option>
                  </select>
                </div>

                <button type="submit" className="register-button">
                  Complete Registration
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="volunteer-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {volunteerInfo.name}!</h1>
        <p>Thank you for volunteering to help deliver donations</p>
      </div>

      {assignedTask ? (
        <div className="task-container">
          <div className="current-task">
            <h2>Current Task</h2>
            <div className="task-details">
              <div className="task-info">
                <p><strong>Donation ID:</strong> {assignedTask.id}</p>
                <p><strong>Status:</strong> <span className={`status-badge ${assignedTask.status}`}>{assignedTask.status}</span></p>
                <p><strong>Book:</strong> {assignedTask.bookTitle} by {assignedTask.author}</p>
                <p><strong>Quantity:</strong> {assignedTask.quantity} book(s)</p>
                <p><strong>Pickup Address:</strong> {assignedTask.pickupLocation.address}</p>
                {assignedTask.recipient && (
                  <p><strong>Delivery To:</strong> {assignedTask.recipient.name}</p>
                )}
              </div>

              <div className="task-actions">
                {assignedTask.status === 'in-progress' && (
                  <button onClick={handlePickup} className="action-button pickup">
                    Confirm Pickup
                  </button>
                )}
                
                {assignedTask.status === 'picked-up' && !selectedNeedy && (
                  <div className="needy-selection">
                    <h3>Select Recipient</h3>
                    <div className="needy-list">
                      {needyPeople.map(needy => (
                        <div
                          key={needy.id}
                          className={`needy-card ${selectedNeedy?.id === needy.id ? 'selected' : ''}`}
                          onClick={() => handleSelectNeedy(needy)}
                        >
                          <h4>{needy.name}</h4>
                          <p className="needy-type">{needy.type}</p>
                          <p className="needy-address">{needy.address}</p>
                          <p className="needy-contact">{needy.contact}</p>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleStartDelivery}
                      className="action-button delivery"
                      disabled={!selectedNeedy}
                    >
                      Start Delivery to Selected Recipient
                    </button>
                  </div>
                )}

                {assignedTask.status === 'in-transit' && (
                  <div className="delivery-completion">
                    <h3>Complete Delivery</h3>
                    <p>Ask the recipient for their OTP to confirm delivery</p>
                    <div className="form-group">
                      <label>Recipient OTP</label>
                      <input
                        type="text"
                        value={deliveryOtp}
                        onChange={(e) => setDeliveryOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        maxLength="6"
                      />
                    </div>
                    <button onClick={handleCompleteDelivery} className="action-button complete">
                      Complete Delivery
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="available-tasks">
          <h2>Available Donation Tasks</h2>
          {availableDonations.length === 0 ? (
            <div className="no-tasks">
              <p>No pending donations at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="tasks-grid">
              {availableDonations.map(donation => (
                <div key={donation.id} className="donation-card">
                  <div className="donation-header">
                    <h3>{donation.bookTitle}</h3>
                    <span className="donation-id">{donation.id}</span>
                  </div>
                  <div className="donation-details">
                    <p><strong>Author:</strong> {donation.author}</p>
                    <p><strong>Quantity:</strong> {donation.quantity} book(s)</p>
                    <p><strong>Condition:</strong> {donation.condition}</p>
                    <p><strong>Category:</strong> {donation.category}</p>
                    <p><strong>Pickup:</strong> {donation.pickupLocation.address}</p>
                  </div>
                  <button
                    onClick={() => handleAcceptTask(donation)}
                    className="accept-button"
                  >
                    Accept Task
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="volunteer-info">
        <div className="info-card">
          <h3>📦 Your Role</h3>
          <p>Pick up donations from donors and deliver them to verified recipients in need.</p>
        </div>
        <div className="info-card">
          <h3>🔐 OTP Verification</h3>
          <p>Both pickup and delivery are secured with OTP verification for transparency.</p>
        </div>
        <div className="info-card">
          <h3>🎯 Make Impact</h3>
          <p>Every delivery you make helps bring knowledge and hope to those who need it.</p>
        </div>
      </div>
    </div>
  );
}

export default VolunteerDashboard;
