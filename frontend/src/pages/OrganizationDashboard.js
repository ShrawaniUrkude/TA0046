import React, { useState, useEffect } from 'react';
import './OrganizationDashboard.css';

function OrganizationDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [donations, setDonations] = useState([]);
  const [activeVolunteers, setActiveVolunteers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);

  // Organization Profile State
  const [orgProfile] = useState({
    name: 'CareConnect Foundation',
    areasServed: ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
    contact: {
      email: 'contact@careconnect.org',
      phone: '+91 98765 43210',
      address: '123 Charity Lane, Mumbai 400001'
    },
    verificationStatus: 'verified',
    categoriesAccepted: ['Food', 'Clothes', 'Education', 'Medical', 'Essentials']
  });

  // Donation Request Form State
  const [newRequest, setNewRequest] = useState({
    category: '',
    itemDescription: '',
    quantityNeeded: '',
    urgencyLevel: 'Medium',
    location: ''
  });

  // Inventory State
  const [inventory] = useState([
    { id: 1, item: 'Rice Bags (10kg)', received: 50, distributed: 35, date: '2026-02-20', beneficiaryType: 'Flood Victims' },
    { id: 2, item: 'Winter Blankets', received: 100, distributed: 80, date: '2026-02-19', beneficiaryType: 'Homeless Shelter' },
    { id: 3, item: 'School Books', received: 200, distributed: 150, date: '2026-02-18', beneficiaryType: 'Orphanage' },
    { id: 4, item: 'Medicine Kits', received: 30, distributed: 25, date: '2026-02-17', beneficiaryType: 'Rural Clinic' },
    { id: 5, item: 'Clothes Bundle', received: 75, distributed: 60, date: '2026-02-16', beneficiaryType: 'Women Shelter' }
  ]);

  // AI Predictions State
  const [aiPredictions] = useState({
    predictedNeeds: [
      { category: 'Food', demand: 'High', reason: 'Festival season approaching' },
      { category: 'Clothes', demand: 'Medium', reason: 'Winter ending, reduced demand' },
      { category: 'Education', demand: 'High', reason: 'New academic year starting' },
      { category: 'Medical', demand: 'Medium', reason: 'Seasonal flu season' }
    ],
    priorityCategories: ['Food', 'Education', 'Medical'],
    seasonalTrends: 'March typically sees 40% increase in education supplies demand',
    areaWiseDemand: [
      { area: 'Mumbai', topNeed: 'Food', urgency: 'High' },
      { area: 'Pune', topNeed: 'Education', urgency: 'Medium' },
      { area: 'Nagpur', topNeed: 'Medical', urgency: 'High' }
    ]
  });

  // Donation Requests State
  const [donationRequests, setDonationRequests] = useState([
    { id: 1, category: 'Food', item: 'Rice and Dal', quantity: '100 kg', urgency: 'High', location: 'Mumbai', status: 'active' },
    { id: 2, category: 'Education', item: 'School Uniforms', quantity: '50 sets', urgency: 'Medium', location: 'Pune', status: 'active' },
    { id: 3, category: 'Medical', item: 'First Aid Kits', quantity: '20 kits', urgency: 'High', location: 'Nagpur', status: 'fulfilled' }
  ]);

  // Thank You Message State
  const [thankYouMessage, setThankYouMessage] = useState('');
  const [impactSummary, setImpactSummary] = useState('');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    const allDonations = JSON.parse(localStorage.getItem('donations') || '[]');
    setDonations(allDonations);
    
    // Extract unique volunteers
    const volunteers = allDonations
      .filter(d => d.volunteer)
      .map(d => d.volunteer)
      .reduce((acc, v) => {
        if (!acc.find(vol => vol.id === v.id)) {
          acc.push(v);
        }
        return acc;
      }, []);
    
    setActiveVolunteers(volunteers);

    // Generate notifications
    const newNotifications = [
      { id: 1, type: 'new', message: 'New donation assigned: Food items from Donor #D001', time: '5 min ago', read: false },
      { id: 2, type: 'delay', message: 'Volunteer delay: Pickup #P003 delayed by 30 mins', time: '15 min ago', read: false },
      { id: 3, type: 'urgent', message: 'Urgent: Medical supplies request needs attention', time: '1 hour ago', read: true },
      { id: 4, type: 'new', message: 'New volunteer registered: Rahul S.', time: '2 hours ago', read: true },
      { id: 5, type: 'complete', message: 'Donation #D005 successfully delivered', time: '3 hours ago', read: true }
    ];
    setNotifications(newNotifications);
  };

  const getStatusStats = () => {
    return {
      total: donations.length,
      pending: donations.filter(d => d.status === 'pending').length,
      inProgress: donations.filter(d => ['in-progress', 'picked-up', 'in-transit'].includes(d.status)).length,
      delivered: donations.filter(d => d.status === 'delivered').length
    };
  };

  const stats = getStatusStats();

  const handleCreateRequest = () => {
    if (newRequest.category && newRequest.itemDescription && newRequest.quantityNeeded && newRequest.location) {
      const request = {
        id: donationRequests.length + 1,
        category: newRequest.category,
        item: newRequest.itemDescription,
        quantity: newRequest.quantityNeeded,
        urgency: newRequest.urgencyLevel,
        location: newRequest.location,
        status: 'active'
      };
      setDonationRequests([...donationRequests, request]);
      setNewRequest({ category: '', itemDescription: '', quantityNeeded: '', urgencyLevel: 'Medium', location: '' });
      setShowRequestModal(false);
    }
  };

  const handleSendThankYou = () => {
    if (thankYouMessage && selectedDonor) {
      alert(`Thank you message sent to ${selectedDonor.name}!`);
      setThankYouMessage('');
      setImpactSummary('');
      setSelectedDonor(null);
      setShowThankYouModal(false);
    }
  };

  const markNotificationRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const tabs = [
    { id: 'profile', label: 'Organization Profile', icon: '🏢' },
    { id: 'requests', label: 'Needs Management', icon: '📋' },
    { id: 'tracker', label: 'Donations Tracker', icon: '📦' },
    { id: 'volunteers', label: 'Volunteer Panel', icon: '👥' },
    { id: 'verification', label: 'Proof & Verification', icon: '✅' },
    { id: 'inventory', label: 'Inventory Log', icon: '📊' },
    { id: 'ai', label: 'AI Analysis', icon: '🤖' },
    { id: 'feedback', label: 'Feedback & Impact', icon: '💝' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' }
  ];

  return (
    <div className="org-dashboard">
      <div className="org-header">
        <h1>Organization Dashboard</h1>
        <p>Manage donations, volunteers, and track your organization's impact</p>
      </div>

      {/* Quick Stats */}
      <div className="org-quick-stats">
        <div className="quick-stat">
          <span className="stat-num">{stats.total}</span>
          <span className="stat-text">Total Donations</span>
        </div>
        <div className="quick-stat">
          <span className="stat-num">{stats.inProgress}</span>
          <span className="stat-text">In Progress</span>
        </div>
        <div className="quick-stat">
          <span className="stat-num">{stats.delivered}</span>
          <span className="stat-text">Delivered</span>
        </div>
        <div className="quick-stat">
          <span className="stat-num">{activeVolunteers.length}</span>
          <span className="stat-text">Active Volunteers</span>
        </div>
        <div className="quick-stat notification-stat">
          <span className="stat-num">{notifications.filter(n => !n.read).length}</span>
          <span className="stat-text">New Alerts</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="org-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`org-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="org-content">
        {/* 1. Organization Profile */}
        {activeTab === 'profile' && (
          <div className="org-section profile-section">
            <h2>🏢 Organization Profile</h2>
            <div className="profile-grid">
              <div className="profile-card main-info">
                <div className="org-logo">🏛️</div>
                <h3>{orgProfile.name}</h3>
                <div className={`verification-badge ${orgProfile.verificationStatus}`}>
                  {orgProfile.verificationStatus === 'verified' ? '✓ Admin Verified' : 'Pending Verification'}
                </div>
              </div>

              <div className="profile-card">
                <h4>📍 Areas Served</h4>
                <div className="areas-tags">
                  {orgProfile.areasServed.map((area, idx) => (
                    <span key={idx} className="area-tag">{area}</span>
                  ))}
                </div>
              </div>

              <div className="profile-card">
                <h4>📞 Contact Details</h4>
                <p><strong>Email:</strong> {orgProfile.contact.email}</p>
                <p><strong>Phone:</strong> {orgProfile.contact.phone}</p>
                <p><strong>Address:</strong> {orgProfile.contact.address}</p>
              </div>

              <div className="profile-card categories-card">
                <h4>📦 Donation Categories Accepted</h4>
                <div className="categories-grid">
                  {orgProfile.categoriesAccepted.map((cat, idx) => (
                    <div key={idx} className="category-badge">
                      <span className="cat-icon">
                        {cat === 'Food' ? '🍲' : cat === 'Clothes' ? '👕' : cat === 'Education' ? '📚' : cat === 'Medical' ? '💊' : '🧴'}
                      </span>
                      <span>{cat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="trust-note">
              <span>📌</span> Complete profile builds donor trust and improves donation matching
            </div>
          </div>
        )}

        {/* 2. Current Needs / Requests Management */}
        {activeTab === 'requests' && (
          <div className="org-section requests-section">
            <div className="section-header">
              <h2>📋 Current Needs / Requests Management</h2>
              <button className="create-request-btn" onClick={() => setShowRequestModal(true)}>
                + Create New Request
              </button>
            </div>

            <div className="requests-grid">
              {donationRequests.map(request => (
                <div key={request.id} className={`request-card ${request.status}`}>
                  <div className="request-header">
                    <span className={`urgency-badge ${request.urgency.toLowerCase()}`}>
                      {request.urgency} Priority
                    </span>
                    <span className={`status-tag ${request.status}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                  <div className="request-category">
                    <span className="cat-icon">
                      {request.category === 'Food' ? '🍲' : request.category === 'Clothes' ? '👕' : 
                       request.category === 'Education' ? '📚' : request.category === 'Medical' ? '💊' : '🧴'}
                    </span>
                    {request.category}
                  </div>
                  <h4>{request.item}</h4>
                  <p><strong>Quantity:</strong> {request.quantity}</p>
                  <p><strong>Location:</strong> {request.location}</p>
                  <div className="request-actions">
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn">Delete</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="trust-note">
              <span>📌</span> Solves mismatch between donations and real needs
            </div>
          </div>
        )}

        {/* 3. Incoming Donations Tracker */}
        {activeTab === 'tracker' && (
          <div className="org-section tracker-section">
            <h2>📦 Incoming Donations Tracker</h2>
            <div className="tracker-table-container">
              <table className="tracker-table">
                <thead>
                  <tr>
                    <th>Donor ID/Name</th>
                    <th>Category & Item</th>
                    <th>Assigned Volunteer</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="no-data">No donations to track</td>
                    </tr>
                  ) : (
                    donations.map(donation => (
                      <tr key={donation.id}>
                        <td>
                          <div className="donor-info">
                            <span className="donor-id">{donation.id}</span>
                            <span className="donor-name">{donation.donorName}</span>
                          </div>
                        </td>
                        <td>
                          <div className="item-info">
                            <span className="item-category">{donation.category}</span>
                            <span className="item-name">{donation.bookTitle || donation.itemName || 'Items'}</span>
                          </div>
                        </td>
                        <td>
                          {donation.volunteer ? (
                            <div className="volunteer-info">
                              <span className="vol-name">{donation.volunteer.name}</span>
                              <span className="vol-phone">{donation.volunteer.phone}</span>
                            </div>
                          ) : (
                            <span className="unassigned">Not Assigned</span>
                          )}
                        </td>
                        <td>
                          <div className="status-tracker-mini">
                            <div className={`status-step ${['pending', 'in-progress', 'picked-up', 'in-transit', 'delivered'].indexOf(donation.status) >= 0 ? 'completed' : ''}`}>
                              <span className="step-dot"></span>
                              <span className="step-label">Accepted</span>
                            </div>
                            <div className={`status-step ${['picked-up', 'in-transit', 'delivered'].includes(donation.status) ? 'completed' : ''}`}>
                              <span className="step-dot"></span>
                              <span className="step-label">Picked Up</span>
                            </div>
                            <div className={`status-step ${['in-transit', 'delivered'].includes(donation.status) ? 'completed' : ''}`}>
                              <span className="step-dot"></span>
                              <span className="step-label">In Transit</span>
                            </div>
                            <div className={`status-step ${donation.status === 'delivered' ? 'completed' : ''}`}>
                              <span className="step-dot"></span>
                              <span className="step-label">Delivered</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <button className="view-details-btn">View Details</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="trust-note">
              <span>📌</span> Ensures transparency and accountability
            </div>
          </div>
        )}

        {/* 4. Volunteer Coordination Panel */}
        {activeTab === 'volunteers' && (
          <div className="org-section volunteers-section">
            <h2>👥 Volunteer Coordination Panel</h2>
            <div className="volunteers-grid">
              {activeVolunteers.length === 0 ? (
                <div className="no-volunteers">
                  <p>No active volunteers at the moment</p>
                </div>
              ) : (
                activeVolunteers.map(volunteer => {
                  const assignedTasks = donations.filter(d => d.volunteer?.id === volunteer.id);
                  const completedTasks = assignedTasks.filter(d => d.status === 'delivered').length;
                  const activeTasks = assignedTasks.filter(d => d.status !== 'delivered').length;
                  
                  return (
                    <div key={volunteer.id} className="volunteer-panel-card">
                      <div className="volunteer-avatar">👤</div>
                      <div className="volunteer-details">
                        <h4>{volunteer.name}</h4>
                        <p className="vol-contact">📞 {volunteer.phone}</p>
                        <p className="vol-contact">✉️ {volunteer.email}</p>
                        <p className="vol-vehicle">🚗 {volunteer.vehicle}</p>
                      </div>
                      <div className="volunteer-availability">
                        <span className="availability-badge available">Available</span>
                      </div>
                      <div className="task-progress">
                        <h5>Task Progress</h5>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${assignedTasks.length > 0 ? (completedTasks / assignedTasks.length) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <div className="progress-stats">
                          <span>Active: {activeTasks}</span>
                          <span>Completed: {completedTasks}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="trust-note">
              <span>📌</span> Reduces manual coordination
            </div>
          </div>
        )}

        {/* 5. Proof & Verification Section */}
        {activeTab === 'verification' && (
          <div className="org-section verification-section">
            <h2>✅ Proof & Verification Section</h2>
            <div className="verification-grid">
              {donations.filter(d => d.status === 'delivered' || d.status === 'picked-up').length === 0 ? (
                <div className="no-proofs">
                  <p>No proofs to verify yet</p>
                </div>
              ) : (
                donations.filter(d => d.status === 'delivered' || d.status === 'picked-up').map(donation => (
                  <div key={donation.id} className="verification-card">
                    <div className="verification-header">
                      <span className="donation-ref">Donation #{donation.id}</span>
                      <span className={`verification-status ${donation.verified ? 'verified' : 'pending'}`}>
                        {donation.verified ? '✓ Verified' : 'Pending Review'}
                      </span>
                    </div>
                    <div className="proof-images">
                      <div className="proof-item">
                        <h5>📸 Pickup Proof</h5>
                        <div className="proof-placeholder">
                          {donation.pickupProof ? (
                            <img src={donation.pickupProof} alt="Pickup proof" />
                          ) : (
                            <span>No image uploaded</span>
                          )}
                        </div>
                        <p className="timestamp">
                          {donation.pickedUpAt ? new Date(donation.pickedUpAt).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                      <div className="proof-item">
                        <h5>📸 Delivery Proof</h5>
                        <div className="proof-placeholder">
                          {donation.deliveryProof ? (
                            <img src={donation.deliveryProof} alt="Delivery proof" />
                          ) : (
                            <span>No image uploaded</span>
                          )}
                        </div>
                        <p className="timestamp">
                          {donation.deliveredAt ? new Date(donation.deliveredAt).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="verification-actions">
                      <button className="approve-btn">✓ Approve</button>
                      <button className="flag-btn">⚠ Flag Issue</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="trust-note">
              <span>📌</span> Prevents fake or incomplete donations
            </div>
          </div>
        )}

        {/* 6. Inventory / Distribution Log */}
        {activeTab === 'inventory' && (
          <div className="org-section inventory-section">
            <h2>📊 Inventory / Distribution Log</h2>
            <div className="inventory-summary">
              <div className="inventory-stat">
                <span className="inv-icon">📥</span>
                <div>
                  <span className="inv-num">{inventory.reduce((sum, i) => sum + i.received, 0)}</span>
                  <span className="inv-label">Total Received</span>
                </div>
              </div>
              <div className="inventory-stat">
                <span className="inv-icon">📤</span>
                <div>
                  <span className="inv-num">{inventory.reduce((sum, i) => sum + i.distributed, 0)}</span>
                  <span className="inv-label">Total Distributed</span>
                </div>
              </div>
              <div className="inventory-stat">
                <span className="inv-icon">📦</span>
                <div>
                  <span className="inv-num">{inventory.reduce((sum, i) => sum + (i.received - i.distributed), 0)}</span>
                  <span className="inv-label">In Stock</span>
                </div>
              </div>
            </div>

            <div className="inventory-table-container">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Received</th>
                    <th>Distributed</th>
                    <th>Remaining</th>
                    <th>Date</th>
                    <th>Beneficiary Type</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map(item => (
                    <tr key={item.id}>
                      <td>{item.item}</td>
                      <td className="num-cell">{item.received}</td>
                      <td className="num-cell">{item.distributed}</td>
                      <td className="num-cell remaining">{item.received - item.distributed}</td>
                      <td>{item.date}</td>
                      <td><span className="beneficiary-tag">{item.beneficiaryType}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="trust-note">
              <span>📌</span> Helps NGOs manage resources efficiently
            </div>
          </div>
        )}

        {/* 7. AI-Based Demand Analysis */}
        {activeTab === 'ai' && (
          <div className="org-section ai-section">
            <h2>🤖 AI-Based Demand Analysis</h2>
            
            <div className="ai-grid">
              <div className="ai-card predictions">
                <h4>📈 Predicted Donation Needs</h4>
                <div className="predictions-list">
                  {aiPredictions.predictedNeeds.map((pred, idx) => (
                    <div key={idx} className="prediction-item">
                      <div className="pred-category">
                        <span className="cat-icon">
                          {pred.category === 'Food' ? '🍲' : pred.category === 'Clothes' ? '👕' : 
                           pred.category === 'Education' ? '📚' : '💊'}
                        </span>
                        {pred.category}
                      </div>
                      <span className={`demand-badge ${pred.demand.toLowerCase()}`}>{pred.demand} Demand</span>
                      <p className="pred-reason">{pred.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ai-card priority">
                <h4>⭐ Priority Categories</h4>
                <div className="priority-list">
                  {aiPredictions.priorityCategories.map((cat, idx) => (
                    <div key={idx} className="priority-item">
                      <span className="priority-rank">#{idx + 1}</span>
                      <span className="priority-name">{cat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ai-card trends">
                <h4>📊 Seasonal Trends</h4>
                <p>{aiPredictions.seasonalTrends}</p>
              </div>

              <div className="ai-card area-demand">
                <h4>📍 Area-wise Demand</h4>
                <div className="area-demand-list">
                  {aiPredictions.areaWiseDemand.map((area, idx) => (
                    <div key={idx} className="area-item">
                      <span className="area-name">{area.area}</span>
                      <span className="area-need">Top Need: {area.topNeed}</span>
                      <span className={`area-urgency ${area.urgency.toLowerCase()}`}>{area.urgency}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="trust-note">
              <span>📌</span> Avoids over-donation or shortages
            </div>
          </div>
        )}

        {/* 8. Feedback & Impact Reporting */}
        {activeTab === 'feedback' && (
          <div className="org-section feedback-section">
            <h2>💝 Feedback & Impact Reporting</h2>
            
            <div className="impact-stats-grid">
              <div className="impact-stat">
                <span className="impact-icon">👥</span>
                <span className="impact-num">1,250+</span>
                <span className="impact-label">People Helped</span>
              </div>
              <div className="impact-stat">
                <span className="impact-icon">📦</span>
                <span className="impact-num">500+</span>
                <span className="impact-label">Donations Delivered</span>
              </div>
              <div className="impact-stat">
                <span className="impact-icon">🏫</span>
                <span className="impact-num">15</span>
                <span className="impact-label">Communities Served</span>
              </div>
              <div className="impact-stat">
                <span className="impact-icon">🎒</span>
                <span className="impact-num">200</span>
                <span className="impact-label">Children Supported</span>
              </div>
            </div>

            <div className="feedback-actions">
              <div className="feedback-card">
                <h4>💌 Send Thank You to Donors</h4>
                <p>Show gratitude to donors who contributed</p>
                <button className="thank-btn" onClick={() => setShowThankYouModal(true)}>
                  Send Thank You Message
                </button>
              </div>

              <div className="feedback-card">
                <h4>📷 Upload Distribution Photos</h4>
                <p>Share photos from your distribution events</p>
                <div className="upload-area">
                  <span>📁 Click to upload photos</span>
                </div>
              </div>

              <div className="feedback-card">
                <h4>📝 Recent Impact Stories</h4>
                <div className="impact-stories">
                  <div className="story-item">
                    <span className="story-icon">🎉</span>
                    <p>"Helped 50 children with school supplies"</p>
                    <span className="story-date">Feb 20, 2026</span>
                  </div>
                  <div className="story-item">
                    <span className="story-icon">🎉</span>
                    <p>"Distributed winter blankets to 80 homeless"</p>
                    <span className="story-date">Feb 18, 2026</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="trust-note">
              <span>📌</span> Motivates repeat donations
            </div>
          </div>
        )}

        {/* 9. Notifications & Alerts */}
        {activeTab === 'notifications' && (
          <div className="org-section notifications-section">
            <h2>🔔 Notifications & Alerts</h2>
            <div className="notifications-list">
              {notifications.map(notif => (
                <div 
                  key={notif.id} 
                  className={`notification-item ${notif.type} ${notif.read ? 'read' : 'unread'}`}
                  onClick={() => markNotificationRead(notif.id)}
                >
                  <div className="notif-icon">
                    {notif.type === 'new' ? '📥' : notif.type === 'delay' ? '⏰' : 
                     notif.type === 'urgent' ? '🚨' : '✅'}
                  </div>
                  <div className="notif-content">
                    <p className="notif-message">{notif.message}</p>
                    <span className="notif-time">{notif.time}</span>
                  </div>
                  {!notif.read && <span className="unread-dot"></span>}
                </div>
              ))}
            </div>
            <div className="trust-note">
              <span>📌</span> Improves response time
            </div>
          </div>
        )}
      </div>

      {/* Create Request Modal */}
      {showRequestModal && (
        <div className="modal-overlay" onClick={() => setShowRequestModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Create Donation Request</h3>
            <div className="modal-form">
              <div className="form-group">
                <label>Donation Category</label>
                <select 
                  value={newRequest.category} 
                  onChange={e => setNewRequest({...newRequest, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  <option value="Food">Food</option>
                  <option value="Clothes">Clothes</option>
                  <option value="Education">Education</option>
                  <option value="Medical">Medical</option>
                  <option value="Essentials">Essentials</option>
                </select>
              </div>
              <div className="form-group">
                <label>Item Description</label>
                <input 
                  type="text" 
                  placeholder="e.g., Rice, Dal, Cooking Oil"
                  value={newRequest.itemDescription}
                  onChange={e => setNewRequest({...newRequest, itemDescription: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Quantity Needed</label>
                <input 
                  type="text" 
                  placeholder="e.g., 50 kg, 100 pieces"
                  value={newRequest.quantityNeeded}
                  onChange={e => setNewRequest({...newRequest, quantityNeeded: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Urgency Level</label>
                <select 
                  value={newRequest.urgencyLevel} 
                  onChange={e => setNewRequest({...newRequest, urgencyLevel: e.target.value})}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Location of Requirement</label>
                <input 
                  type="text" 
                  placeholder="e.g., Mumbai, Pune"
                  value={newRequest.location}
                  onChange={e => setNewRequest({...newRequest, location: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowRequestModal(false)}>Cancel</button>
                <button className="submit-btn" onClick={handleCreateRequest}>Create Request</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thank You Modal */}
      {showThankYouModal && (
        <div className="modal-overlay" onClick={() => setShowThankYouModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Send Thank You Message</h3>
            <div className="modal-form">
              <div className="form-group">
                <label>Select Donor</label>
                <select 
                  value={selectedDonor?.id || ''} 
                  onChange={e => {
                    const donor = donations.find(d => d.id === e.target.value);
                    setSelectedDonor(donor ? { id: donor.id, name: donor.donorName } : null);
                  }}
                >
                  <option value="">Select a donor</option>
                  {donations.map(d => (
                    <option key={d.id} value={d.id}>{d.donorName} ({d.id})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Thank You Message</label>
                <textarea 
                  placeholder="Write your thank you message..."
                  value={thankYouMessage}
                  onChange={e => setThankYouMessage(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="form-group">
                <label>Impact Summary (optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g., Helped 50 children with school supplies"
                  value={impactSummary}
                  onChange={e => setImpactSummary(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowThankYouModal(false)}>Cancel</button>
                <button className="submit-btn" onClick={handleSendThankYou}>Send Message</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrganizationDashboard;
