import React, { useState, useEffect } from 'react';
import './OrganizationDashboard.css';

function OrganizationDashboard() {
  const [donations, setDonations] = useState([]);
  const [completedDeliveries, setCompletedDeliveries] = useState([]);
  const [activeVolunteers, setActiveVolunteers] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    const allDonations = JSON.parse(localStorage.getItem('donations') || '[]');
    const completed = JSON.parse(localStorage.getItem('completedDeliveries') || '[]');
    
    setDonations(allDonations);
    setCompletedDeliveries(completed);
    
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
  };

  const getFilteredDonations = () => {
    if (filter === 'all') return donations;
    return donations.filter(d => d.status === filter);
  };

  const getStatusStats = () => {
    return {
      total: donations.length,
      pending: donations.filter(d => d.status === 'pending').length,
      inProgress: donations.filter(d => d.status === 'in-progress').length,
      pickedUp: donations.filter(d => d.status === 'picked-up').length,
      inTransit: donations.filter(d => d.status === 'in-transit').length,
      delivered: donations.filter(d => d.status === 'delivered').length
    };
  };

  const stats = getStatusStats();
  const filteredDonations = getFilteredDonations();

  return (
    <div className="organization-dashboard">
      <div className="dashboard-header">
        <h1>Organization Dashboard</h1>
        <p>Monitor and manage all donations and volunteer activities</p>
      </div>

      <div className="stats-container">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Donations</div>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>

        <div className="stat-card in-progress">
          <div className="stat-icon">🚀</div>
          <div className="stat-content">
            <div className="stat-value">{stats.inProgress + stats.pickedUp + stats.inTransit}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>

        <div className="stat-card delivered">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <div className="stat-value">{stats.delivered}</div>
            <div className="stat-label">Delivered</div>
          </div>
        </div>

        <div className="stat-card volunteers">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{activeVolunteers.length}</div>
            <div className="stat-label">Active Volunteers</div>
          </div>
        </div>
      </div>

      <div className="filter-container">
        <h2>Donation Management</h2>
        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('all')}
          >
            All ({stats.total})
          </button>
          <button
            className={filter === 'pending' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('pending')}
          >
            Pending ({stats.pending})
          </button>
          <button
            className={filter === 'in-progress' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('in-progress')}
          >
            In Progress ({stats.inProgress})
          </button>
          <button
            className={filter === 'picked-up' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('picked-up')}
          >
            Picked Up ({stats.pickedUp})
          </button>
          <button
            className={filter === 'in-transit' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('in-transit')}
          >
            In Transit ({stats.inTransit})
          </button>
          <button
            className={filter === 'delivered' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('delivered')}
          >
            Delivered ({stats.delivered})
          </button>
        </div>
      </div>

      <div className="donations-list">
        {filteredDonations.length === 0 ? (
          <div className="no-donations">
            <p>No donations found for this filter.</p>
          </div>
        ) : (
          filteredDonations.map(donation => (
            <div key={donation.id} className="donation-item">
              <div className="donation-item-header">
                <div className="donation-id-badge">{donation.id}</div>
                <div className={`status-badge ${donation.status}`}>
                  {donation.status.replace('-', ' ').toUpperCase()}
                </div>
              </div>

              <div className="donation-item-content">
                <div className="donation-section">
                  <h3>📚 Book Details</h3>
                  <p><strong>Title:</strong> {donation.bookTitle}</p>
                  <p><strong>Author:</strong> {donation.author}</p>
                  <p><strong>Quantity:</strong> {donation.quantity} book(s)</p>
                  <p><strong>Condition:</strong> {donation.condition}</p>
                  <p><strong>Category:</strong> {donation.category}</p>
                </div>

                <div className="donation-section">
                  <h3>👤 Donor Information</h3>
                  <p><strong>Name:</strong> {donation.donorName}</p>
                  <p><strong>Email:</strong> {donation.donorEmail}</p>
                  <p><strong>Phone:</strong> {donation.donorPhone}</p>
                  <p><strong>Pickup Address:</strong> {donation.pickupLocation.address}</p>
                </div>

                {donation.volunteer && (
                  <div className="donation-section">
                    <h3>🚴 Volunteer Details</h3>
                    <p><strong>Name:</strong> {donation.volunteer.name}</p>
                    <p><strong>Phone:</strong> {donation.volunteer.phone}</p>
                    <p><strong>Vehicle:</strong> {donation.volunteer.vehicle}</p>
                  </div>
                )}

                {donation.recipient && (
                  <div className="donation-section">
                    <h3>🎯 Recipient Details</h3>
                    <p><strong>Name:</strong> {donation.recipient.name}</p>
                    <p><strong>Type:</strong> {donation.recipient.type}</p>
                    <p><strong>Address:</strong> {donation.recipient.address}</p>
                    <p><strong>Contact:</strong> {donation.recipient.contact}</p>
                  </div>
                )}

                <div className="donation-section timeline">
                  <h3>⏰ Timeline</h3>
                  <div className="timeline-item">
                    <span className="timeline-dot completed"></span>
                    <p><strong>Submitted:</strong> {new Date(donation.timestamp).toLocaleString()}</p>
                  </div>
                  {donation.acceptedAt && (
                    <div className="timeline-item">
                      <span className="timeline-dot completed"></span>
                      <p><strong>Accepted:</strong> {new Date(donation.acceptedAt).toLocaleString()}</p>
                    </div>
                  )}
                  {donation.pickedUpAt && (
                    <div className="timeline-item">
                      <span className="timeline-dot completed"></span>
                      <p><strong>Picked Up:</strong> {new Date(donation.pickedUpAt).toLocaleString()}</p>
                    </div>
                  )}
                  {donation.inTransitAt && (
                    <div className="timeline-item">
                      <span className="timeline-dot completed"></span>
                      <p><strong>In Transit:</strong> {new Date(donation.inTransitAt).toLocaleString()}</p>
                    </div>
                  )}
                  {donation.deliveredAt && (
                    <div className="timeline-item">
                      <span className="timeline-dot completed"></span>
                      <p><strong>Delivered:</strong> {new Date(donation.deliveredAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {activeVolunteers.length > 0 && (
        <div className="volunteers-section">
          <h2>Active Volunteers</h2>
          <div className="volunteers-grid">
            {activeVolunteers.map(volunteer => (
              <div key={volunteer.id} className="volunteer-card">
                <div className="volunteer-icon">👤</div>
                <h3>{volunteer.name}</h3>
                <p className="volunteer-phone">{volunteer.phone}</p>
                <p className="volunteer-email">{volunteer.email}</p>
                <div className="volunteer-vehicle">
                  <span className="vehicle-badge">{volunteer.vehicle}</span>
                </div>
                <p className="volunteer-tasks">
                  Tasks: {donations.filter(d => d.volunteer?.id === volunteer.id).length}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="organization-info">
        <div className="info-card">
          <h3>📈 Real-time Monitoring</h3>
          <p>Track all donations and volunteer activities in real-time with automatic updates.</p>
        </div>
        <div className="info-card">
          <h3>🔍 Complete Transparency</h3>
          <p>Full visibility into every stage of the donation process from submission to delivery.</p>
        </div>
        <div className="info-card">
          <h3>📊 Impact Analytics</h3>
          <p>Monitor your organization's impact with detailed statistics and delivery records.</p>
        </div>
      </div>
    </div>
  );
}

export default OrganizationDashboard;
