import React, { useState, useEffect } from 'react';
import './VolunteerDashboard.css';
import { getAvailableDonations, getAcceptedDonations, acceptDonation, declineDonation, updateDeliveryStatus, completeDelivery } from '../utils/donationStorage';

function VolunteerDashboard() {
  const [activeTab, setActiveTab] = useState('available');
  
  // Volunteer Profile State
  const [volunteerProfile, setVolunteerProfile] = useState({
    name: 'Rahul Sharma',
    volunteerId: 'VOL2026001',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@email.com',
    assignedArea: 'Mumbai Central, Maharashtra',
    availability: 'available',
    vehicleType: 'Bike',
    verified: true,
    rating: 4.8,
    completedDeliveries: 156,
    joinedDate: '2025-06-15'
  });

  // Available Donations from Donors
  const [availableDonations, setAvailableDonations] = useState([]);
  
  // Accepted/My Tasks
  const [myTasks, setMyTasks] = useState([]);

  // Selected task for navigation
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Decline modal state
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineTaskId, setDeclineTaskId] = useState(null);
  const [declineReason, setDeclineReason] = useState('');

  // Load donations on mount and periodically refresh
  useEffect(() => {
    loadDonations();
    const interval = setInterval(loadDonations, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDonations = () => {
    const available = getAvailableDonations();
    const accepted = getAcceptedDonations();
    setAvailableDonations(available);
    setMyTasks(accepted);
  };

  // Assigned Tasks State - kept for demo data compatibility
  const [assignedTasks, setAssignedTasks] = useState([
    {
      id: 'TASK001',
      donorName: 'Priya Patel',
      donorId: 'DON2026045',
      category: 'Education',
      categoryIcon: '📚',
      items: 'Textbooks & Notebooks',
      quantity: 25,
      pickupLocation: '45 MG Road, Andheri West, Mumbai',
      pickupCoords: { lat: 19.1364, lng: 72.8296 },
      deliveryLocation: 'Shanti Orphanage, Dharavi, Mumbai',
      deliveryCoords: { lat: 19.0420, lng: 72.8561 },
      priority: 'high',
      status: 'accepted',
      distance: '12.5 km',
      estimatedTime: '35 mins',
      scheduledTime: '10:00 AM - 12:00 PM'
    }
  ]);

  const [selectedTask, setSelectedTask] = useState(null);

  // Task status steps
  const taskStatusSteps = [
    { id: 'accepted', label: 'Accepted', icon: '✓' },
    { id: 'picked', label: 'Picked Up', icon: '📦' },
    { id: 'transit', label: 'In Transit', icon: '🚗' },
    { id: 'delivered', label: 'Delivered', icon: '🎁' }
  ];

  const getStatusIndex = (status) => {
    const statusMap = { 'accepted': 0, 'picked': 1, 'transit': 2, 'delivered': 3 };
    return statusMap[status] || 0;
  };

  const handleAvailabilityToggle = () => {
    setVolunteerProfile(prev => ({
      ...prev,
      availability: prev.availability === 'available' ? 'busy' : 'available'
    }));
  };

  // Handle accepting a donation from available list
  const handleAcceptDonation = (donationId) => {
    const result = acceptDonation(donationId, volunteerProfile.volunteerId, volunteerProfile.name);
    if (result) {
      loadDonations();
      alert('Donation accepted! You can now view the route and pickup details.');
    }
  };

  // Handle declining a donation
  const handleOpenDeclineModal = (donationId) => {
    setDeclineTaskId(donationId);
    setShowDeclineModal(true);
  };

  const handleConfirmDecline = () => {
    if (declineTaskId) {
      declineDonation(declineTaskId, declineReason);
      loadDonations();
      setShowDeclineModal(false);
      setDeclineTaskId(null);
      setDeclineReason('');
    }
  };

  // Handle viewing route for a donation
  const handleViewRoute = (donation) => {
    setSelectedTask({
      ...donation,
      items: donation.itemType,
      category: donation.categoryName,
      categoryIcon: donation.categoryIcon,
      distance: donation.estimatedDistance || '10 km',
      estimatedTime: donation.estimatedTime || '25 mins'
    });
    setActiveTab('navigation');
  };

  const handleAcceptTask = (taskId) => {
    setAssignedTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: 'accepted' } : task
    ));
  };

  const handleUpdateTaskStatus = (taskId, newStatus) => {
    // Update in local state
    setAssignedTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    
    // Also update in shared storage
    if (newStatus === 'picked') {
      updateDeliveryStatus(taskId, 'picked');
    } else if (newStatus === 'transit') {
      updateDeliveryStatus(taskId, 'in-transit');
    } else if (newStatus === 'delivered') {
      completeDelivery(taskId);
      alert('Delivery completed successfully! Thank you for your service.');
      setSelectedTask(null);
      loadDonations();
    }
  };

  const handleSelectTask = (task) => {
    setSelectedTask(task);
    setActiveTab('navigation');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  // Volunteer Profile Section
  const renderProfile = () => (
    <div className="profile-section">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">👨‍💼</div>
          <div className="profile-info">
            <h2>{volunteerProfile.name}</h2>
            <p className="volunteer-id">ID: {volunteerProfile.volunteerId}</p>
            {volunteerProfile.verified && (
              <span className="verified-badge">✓ Verified Volunteer</span>
            )}
          </div>
          <div className="availability-toggle">
            <span className="toggle-label">Status:</span>
            <button 
              className={`toggle-btn ${volunteerProfile.availability}`}
              onClick={handleAvailabilityToggle}
            >
              {volunteerProfile.availability === 'available' ? '🟢 Available' : '🔴 Busy'}
            </button>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-row">
            <span className="detail-icon">📍</span>
            <div className="detail-content">
              <label>Assigned Area</label>
              <p>{volunteerProfile.assignedArea}</p>
            </div>
          </div>
          <div className="detail-row">
            <span className="detail-icon">📞</span>
            <div className="detail-content">
              <label>Phone</label>
              <p>{volunteerProfile.phone}</p>
            </div>
          </div>
          <div className="detail-row">
            <span className="detail-icon">📧</span>
            <div className="detail-content">
              <label>Email</label>
              <p>{volunteerProfile.email}</p>
            </div>
          </div>
          <div className="detail-row">
            <span className="detail-icon">🚗</span>
            <div className="detail-content">
              <label>Vehicle</label>
              <p>{volunteerProfile.vehicleType}</p>
            </div>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">⭐ {volunteerProfile.rating}</span>
            <span className="stat-label">Rating</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{volunteerProfile.completedDeliveries}</span>
            <span className="stat-label">Deliveries</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{new Date(volunteerProfile.joinedDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
            <span className="stat-label">Member Since</span>
          </div>
        </div>
      </div>

      <div className="profile-note">
        <p>📌 Your verified profile ensures accountability and trust with donors and beneficiaries.</p>
      </div>
    </div>
  );

  // Available Donations Section (NEW)
  const renderAvailableDonations = () => (
    <div className="available-donations-section">
      <h2 className="section-title">📦 Available Donations</h2>
      <p className="section-subtitle">New donation requests from donors waiting for pickup</p>

      {availableDonations.length === 0 ? (
        <div className="no-donations-message">
          <div className="empty-icon">📭</div>
          <h3>No Available Donations</h3>
          <p>Check back later for new donation requests from donors.</p>
        </div>
      ) : (
        <div className="donations-grid">
          {availableDonations.map(donation => (
            <div key={donation.id} className="donation-card">
              <div className="donation-header">
                <div className="donation-category">
                  <span className="category-icon">{donation.categoryIcon || '📦'}</span>
                  <span className="category-name">{donation.categoryName || donation.category}</span>
                </div>
                <span className="donation-badge new">New Request</span>
              </div>

              <div className="donation-body">
                <div className="donation-info-row">
                  <span className="info-icon">🎁</span>
                  <div className="info-content">
                    <label>Item</label>
                    <p>{donation.itemType} × {donation.quantity}</p>
                  </div>
                </div>
                
                <div className="donation-info-row">
                  <span className="info-icon">👤</span>
                  <div className="info-content">
                    <label>Donor</label>
                    <p>{donation.donorName || 'Anonymous Donor'}</p>
                  </div>
                </div>

                <div className="donation-info-row">
                  <span className="info-icon">📍</span>
                  <div className="info-content">
                    <label>Pickup Location</label>
                    <p>{donation.pickupLocation}</p>
                  </div>
                </div>

                <div className="donation-info-row">
                  <span className="info-icon">🕐</span>
                  <div className="info-content">
                    <label>Preferred Time</label>
                    <p>{donation.pickupDate} at {donation.pickupTime}</p>
                  </div>
                </div>

                <div className="donation-meta">
                  <span className="meta-item">📏 {donation.estimatedDistance || '~10 km'}</span>
                  <span className="meta-item">⏱️ {donation.estimatedTime || '~25 mins'}</span>
                </div>
              </div>

              <div className="donation-actions">
                <button 
                  className="action-btn accept-btn"
                  onClick={() => handleAcceptDonation(donation.id)}
                >
                  ✓ Accept
                </button>
                <button 
                  className="action-btn decline-btn"
                  onClick={() => handleOpenDeclineModal(donation.id)}
                >
                  ✕ Decline
                </button>
                <button 
                  className="action-btn route-btn"
                  onClick={() => handleViewRoute(donation)}
                >
                  🗺️ View Route
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* My Accepted Tasks */}
      {myTasks.length > 0 && (
        <div className="my-tasks-section">
          <h3 className="subsection-title">✅ My Accepted Deliveries</h3>
          <div className="donations-grid">
            {myTasks.map(task => (
              <div key={task.id} className="donation-card accepted">
                <div className="donation-header">
                  <div className="donation-category">
                    <span className="category-icon">{task.categoryIcon || '📦'}</span>
                    <span className="category-name">{task.categoryName || task.category}</span>
                  </div>
                  <span className="donation-badge accepted">Accepted</span>
                </div>

                <div className="donation-body">
                  <div className="donation-info-row">
                    <span className="info-icon">🎁</span>
                    <div className="info-content">
                      <label>Item</label>
                      <p>{task.itemType} × {task.quantity}</p>
                    </div>
                  </div>
                  
                  <div className="donation-info-row">
                    <span className="info-icon">📍</span>
                    <div className="info-content">
                      <label>Pickup</label>
                      <p>{task.pickupLocation}</p>
                    </div>
                  </div>

                  <div className="donation-info-row">
                    <span className="info-icon">📊</span>
                    <div className="info-content">
                      <label>Status</label>
                      <p className="status-text">{task.deliveryStatus || 'Assigned'}</p>
                    </div>
                  </div>
                </div>

                <div className="donation-actions">
                  <button 
                    className="action-btn route-btn full-width"
                    onClick={() => handleViewRoute(task)}
                  >
                    🗺️ View Route & Navigate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="available-note">
        <p>📌 Accept donations that you can deliver within the preferred time slot for best donor experience.</p>
      </div>

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="modal-overlay">
          <div className="decline-modal">
            <h3>Decline Donation</h3>
            <p>Please provide a reason for declining (optional):</p>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="E.g., Currently unavailable, location too far, etc."
              rows={3}
            />
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowDeclineModal(false)}>
                Cancel
              </button>
              <button className="modal-btn confirm" onClick={handleConfirmDecline}>
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Assigned Tasks Section
  const renderTasks = () => (
    <div className="tasks-section">
      <h2 className="section-title">Assigned Donation Tasks</h2>
      <p className="section-subtitle">Manage your pickup and delivery tasks</p>

      <div className="tasks-list">
        {assignedTasks.map(task => (
          <div key={task.id} className={`task-card ${task.status === 'delivered' ? 'completed' : ''}`}>
            <div className="task-header">
              <div className="task-category">
                <span className="category-icon">{task.categoryIcon}</span>
                <span className="category-name">{task.category}</span>
              </div>
              <div className="task-priority" style={{ background: getPriorityColor(task.priority) }}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
              </div>
            </div>

            <div className="task-body">
              <div className="task-info-row">
                <span className="info-label">👤 Donor:</span>
                <span className="info-value">{task.donorName} ({task.donorId})</span>
              </div>
              <div className="task-info-row">
                <span className="info-label">📦 Items:</span>
                <span className="info-value">{task.items} × {task.quantity}</span>
              </div>
              <div className="task-info-row">
                <span className="info-label">📍 Pickup:</span>
                <span className="info-value">{task.pickupLocation}</span>
              </div>
              <div className="task-info-row">
                <span className="info-label">🏠 Delivery:</span>
                <span className="info-value">{task.deliveryLocation}</span>
              </div>
              <div className="task-info-row">
                <span className="info-label">🕐 Schedule:</span>
                <span className="info-value">{task.scheduledTime}</span>
              </div>
            </div>

            <div className="task-footer">
              <div className="task-meta">
                <span className="meta-item">📏 {task.distance}</span>
                <span className="meta-item">⏱️ {task.estimatedTime}</span>
              </div>
              <div className="task-actions">
                {task.status === 'pending' && (
                  <button className="action-btn accept" onClick={() => handleAcceptTask(task.id)}>
                    Accept Task
                  </button>
                )}
                {task.status !== 'pending' && task.status !== 'delivered' && (
                  <button className="action-btn navigate" onClick={() => handleSelectTask(task)}>
                    Navigate
                  </button>
                )}
                {task.status === 'delivered' && (
                  <span className="completed-badge">✓ Completed</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="tasks-note">
        <p>📌 Accepting and completing tasks promptly helps build trust with donors and organizations.</p>
      </div>
    </div>
  );

  // Task Status Management Section
  const renderStatusManagement = () => (
    <div className="status-section">
      <h2 className="section-title">Task Status Management</h2>
      <p className="section-subtitle">Update the status of your active tasks</p>

      {assignedTasks.filter(t => t.status !== 'pending' && t.status !== 'delivered').length === 0 ? (
        <div className="no-active-tasks">
          <p>No active tasks. Accept a task from the Tasks tab to get started.</p>
        </div>
      ) : (
        <div className="status-cards">
          {assignedTasks.filter(t => t.status !== 'pending' && t.status !== 'delivered').map(task => (
            <div key={task.id} className="status-card">
              <div className="status-card-header">
                <span className="task-icon">{task.categoryIcon}</span>
                <div className="task-brief">
                  <h3>{task.items}</h3>
                  <p>{task.donorName} → {task.deliveryLocation.split(',')[0]}</p>
                </div>
              </div>

              <div className="status-tracker">
                {taskStatusSteps.map((step, index) => (
                  <div 
                    key={step.id}
                    className={`status-step ${getStatusIndex(task.status) >= index ? 'completed' : ''} ${getStatusIndex(task.status) === index ? 'current' : ''}`}
                  >
                    <div className="step-circle">{step.icon}</div>
                    <span className="step-label">{step.label}</span>
                    {index < taskStatusSteps.length - 1 && <div className="step-line"></div>}
                  </div>
                ))}
              </div>

              <div className="status-actions">
                {task.status === 'accepted' && (
                  <button 
                    className="status-btn pickup"
                    onClick={() => handleUpdateTaskStatus(task.id, 'picked')}
                  >
                    📦 Confirm Pickup
                  </button>
                )}
                {task.status === 'picked' && (
                  <button 
                    className="status-btn transit"
                    onClick={() => handleUpdateTaskStatus(task.id, 'transit')}
                  >
                    🚗 Start Transit
                  </button>
                )}
                {task.status === 'transit' && (
                  <button 
                    className="status-btn deliver"
                    onClick={() => handleUpdateTaskStatus(task.id, 'delivered')}
                  >
                    🎁 Complete Delivery
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="status-note">
        <p>📌 Each status update improves transparency for donors and NGOs tracking their donations.</p>
      </div>
    </div>
  );

  // Navigation & Route Assistance Section
  const renderNavigation = () => (
    <div className="navigation-section">
      <h2 className="section-title">Navigation & Route Assistance</h2>
      <p className="section-subtitle">Get directions and estimated times for your deliveries</p>

      {selectedTask ? (
        <div className="navigation-container">
          <div className="selected-task-info">
            <div className="task-badge">{selectedTask.categoryIcon} {selectedTask.category}</div>
            <h3>{selectedTask.items} × {selectedTask.quantity}</h3>
          </div>

          <div className="map-container">
            <div className="map-placeholder">
              <div className="map-icon">🗺️</div>
              <p>Interactive Map View</p>
              <small>Mumbai, Maharashtra</small>
            </div>
          </div>

          <div className="route-details">
            <div className="location-card pickup">
              <div className="location-marker">A</div>
              <div className="location-info">
                <label>📍 Pickup Location</label>
                <p>{selectedTask.pickupLocation}</p>
              </div>
            </div>

            <div className="route-line">
              <div className="route-stats">
                <span className="route-distance">📏 {selectedTask.distance}</span>
                <span className="route-time">⏱️ {selectedTask.estimatedTime}</span>
              </div>
            </div>

            <div className="location-card delivery">
              <div className="location-marker">B</div>
              <div className="location-info">
                <label>🏠 Delivery Location</label>
                <p>{selectedTask.deliveryLocation}</p>
              </div>
            </div>
          </div>

          <div className="navigation-actions">
            <button className="nav-btn directions">
              🧭 Get Directions
            </button>
            <button className="nav-btn call-donor">
              📞 Call Donor
            </button>
            <button className="nav-btn call-recipient">
              📞 Call Recipient
            </button>
          </div>

          <div className="route-suggestion">
            <h4>🚀 Suggested Route</h4>
            <p>Take the Western Express Highway → Exit at Andheri → Turn left on MG Road → Destination on right</p>
            <div className="route-tips">
              <span className="tip">💡 Light traffic expected</span>
              <span className="tip">⛽ 2 fuel stations on route</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-task-selected">
          <div className="empty-icon">🗺️</div>
          <p>Select a task from the Tasks tab to view navigation</p>
          <button className="select-task-btn" onClick={() => setActiveTab('tasks')}>
            Go to Tasks
          </button>
        </div>
      )}

      <div className="navigation-note">
        <p>📌 Following suggested routes reduces delays and ensures timely deliveries.</p>
      </div>
    </div>
  );

  return (
    <div className="volunteer-dashboard">
      <div className="dashboard-header">
        <h1>🙋 Volunteer Dashboard</h1>
        <p>Welcome back, {volunteerProfile.name}!</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'available' ? 'active' : ''}`}
          onClick={() => setActiveTab('available')}
        >
          📦 Available Donations {availableDonations.length > 0 && <span className="tab-badge">{availableDonations.length}</span>}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Profile
        </button>
        <button 
          className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          📋 Tasks
        </button>
        <button 
          className={`tab-btn ${activeTab === 'status' ? 'active' : ''}`}
          onClick={() => setActiveTab('status')}
        >
          📊 Status
        </button>
        <button 
          className={`tab-btn ${activeTab === 'navigation' ? 'active' : ''}`}
          onClick={() => setActiveTab('navigation')}
        >
          🗺️ Navigate
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'available' && renderAvailableDonations()}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'tasks' && renderTasks()}
        {activeTab === 'status' && renderStatusManagement()}
        {activeTab === 'navigation' && renderNavigation()}
      </div>
    </div>
  );
}

export default VolunteerDashboard;
